package instance

// based on https://medium.com/@niondir/my-go-http-server-best-practice-a29773786e15

import (
	"context"
	"errors"
	"fmt"
	"github.com/medhir/blog/server/controllers/storage/cf"
	"net/http"
	"os"
	"time"

	"github.com/medhir/blog/server/controllers/auth"
	"github.com/medhir/blog/server/controllers/storage/gcs"
	"github.com/medhir/blog/server/controllers/storage/sql"

	"github.com/honeycombio/beeline-go/wrappers/hnynethttp"
	"github.com/rs/cors"

	// pq is the database driver for connecting to postgres
	_ "github.com/lib/pq"
	muxgo "github.com/muxinc/mux-go"
)

const (
	// TODO - Move to config
	serverPort       = ":9000"
	local            = "local"
	databaseNameProd = "medhir-com"
)

// Instance represents an instance of the server
type Instance struct {
	ctx    context.Context
	router *http.ServeMux
	server *http.Server
	auth   auth.Auth
	gcs    gcs.GCS
	cf     cf.CF
	db     sql.Postgres
	vid    *muxgo.APIClient
	env    string
}

// NewInstance returns a new instance of the server
func NewInstance() (*Instance, error) {
	ctx := context.Background()
	server := &http.Server{
		Addr: serverPort,
	}

	defaultBucket, ok := os.LookupEnv("DEFAULT_GCS_BUCKET")
	if !ok {
		return nil, errors.New("DEFAULT_GCS_BUCKET must be provided")
	}

	gcs, err := gcs.NewGCS(ctx, defaultBucket)
	if err != nil {
		return nil, err
	}

	environment, ok := os.LookupEnv("ENVIRONMENT")
	if !ok {
		environment = local
	}

	// environment config
	host, ok := os.LookupEnv("POSTGRES_HOST")
	if !ok {
		return nil, errors.New("POSTGRES_HOST must be provided")
	}
	port, ok := os.LookupEnv("POSTGRES_PORT")
	if !ok {
		return nil, errors.New("POSTGRES_PORT must be provided")
	}
	user, ok := os.LookupEnv("POSTGRES_USER")
	if !ok {
		return nil, errors.New("POSTGRES_USER must be provided")
	}
	password, ok := os.LookupEnv("POSTGRES_PASSWORD")
	if !ok {
		return nil, errors.New("POSTGRES_PASSWORD must be provided")
	}
	var databaseName string
	databaseName, ok = os.LookupEnv("POSTGRES_DATABASE")
	if !ok {
		databaseName = databaseNameProd
	}
	keycloakBaseURL, ok := os.LookupEnv("KEYCLOAK_BASE_URL")
	if !ok {
		return nil, errors.New("KEYCLOAK_BASE_URL must be provided")
	}
	keycloakClientID, ok := os.LookupEnv("KEYCLOAK_CLIENT_ID")
	if !ok {
		return nil, errors.New("KEYCLOAK_CLIENT_ID environment variable must be provided")
	}
	keycloakClientSecret, ok := os.LookupEnv("KEYCLOAK_CLIENT_SECRET")
	if !ok {
		return nil, errors.New("KEYCLOAK_CLIENT_SECRET environment variable must be provided")
	}
	keycloakAdminUsername, ok := os.LookupEnv("KEYCLOAK_ADMIN_USERNAME")
	if !ok {
		return nil, errors.New("KEYCLOAK_ADMIN_USERNAME environment variable must be provided")
	}
	keycloakAdminPassword, ok := os.LookupEnv("KEYCLOAK_ADMIN_PASSWORD")
	if !ok {
		return nil, errors.New("KEYCLOAK_ADMIN_PASSWORD environment variable must be provided")
	}

	// cloudflare config
	cloudflareEmail, ok := os.LookupEnv("CLOUDFLARE_EMAIL")
	if !ok {
		return nil, errors.New("CLOUDFLARE_EMAIL must be provided")
	}
	cloudflareAccountID, ok := os.LookupEnv("CLOUDFLARE_ACCOUNT_ID")
	if !ok {
		return nil, errors.New("CLOUDFLARE_ACCOUNT_ID must be provided")
	}
	cloudflareApiKey, ok := os.LookupEnv("CLOUDFLARE_API_KEY")
	if !ok {
		return nil, errors.New("CLOUDFLARE_API_KEY must be provided")
	}

	// mux config
	muxToken, ok := os.LookupEnv("MUX_ACCESS_TOKEN")
	if !ok {
		return nil, errors.New("MUX_ACCESS_TOKEN must be provided")
	}
	muxSecret, ok := os.LookupEnv("MUX_TOKEN_SECRET")
	if !ok {
		return nil, errors.New("MUX_TOKEN_SECRET must be provided")
	}

	video := muxgo.NewAPIClient(
		muxgo.NewConfiguration(
			muxgo.WithBasicAuth(muxToken, muxSecret),
		))

	cloudflare, err := cf.NewCF(ctx, cloudflareApiKey, cloudflareEmail, cloudflareAccountID)
	if err != nil {
		return nil, err
	}

	// init DB connection
	db, err := sql.NewPostgres(
		fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", user, password, host, port, databaseName),
		"controllers/storage/sql/migrations",
	)
	if err != nil {
		return nil, err
	}

	// init Keycloak client
	keycloakCfg := &auth.KeycloakConfig{
		BaseURL:       keycloakBaseURL,
		ClientID:      keycloakClientID,
		ClientSecret:  keycloakClientSecret,
		AdminUsername: keycloakAdminUsername,
		AdminPassword: keycloakAdminPassword,
	}
	auth, err := auth.NewAuth(ctx, keycloakCfg, db)

	if err != nil {
		return nil, err
	}

	instance := &Instance{
		ctx:    ctx,
		router: http.DefaultServeMux,
		server: server,
		auth:   auth,
		gcs:    gcs,
		cf:     cloudflare,
		vid:    video,
		env:    environment,
		db:     db,
	}

	// initialize routes for serve mux
	err = instance.AddRoutes()
	if err != nil {
		return nil, err
	}

	// enable CORS
	if environment == local {
		// dev mode
		c := cors.New(cors.Options{
			AllowedOrigins:   []string{"http://localhost:3000", "http://127.0.0.1:3000", "http://medhir:3000"},
			Debug:            true,
			AllowCredentials: true,
			AllowedMethods:   []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodPatch},
			AllowedHeaders:   []string{"Authorization", "Content-Type", "Set-Cookie"}})
		instance.server.Handler = hnynethttp.WrapHandler(c.Handler(instance.router))
	} else {
		c := cors.New(cors.Options{
			AllowedOrigins:   []string{"https://review.medhir.com", "https://test.medhir.com", "https://medhir.com"},
			Debug:            true,
			AllowCredentials: true,
			AllowedMethods:   []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodPatch},
			AllowedHeaders:   []string{"Authorization", "Content-Type", "Set-Cookie"}})
		instance.server.Handler = hnynethttp.WrapHandler(c.Handler(instance.router))
	}

	return instance, nil
}

// Start initializes a server instance
func (i *Instance) Start() {
	fmt.Print(fmt.Sprintf("Instance listening on port %s...", i.server.Addr))
	err := i.server.ListenAndServe() // Start doesn't return until the server connection breaks
	if err != nil {
		fmt.Println("Server stopped unexpectedly.", err)
		i.Shutdown() // gracefully shut down on exit
	}
}

// Shutdown gracefully shuts down a server instance
func (i *Instance) Shutdown() {
	if i.server != nil {
		ctx, cancel := context.WithTimeout(i.ctx, 10*time.Second)
		defer cancel()
		err := i.db.Close()
		if err != nil {
			fmt.Println("Failed to shut down server gracefully.", err)
		}
		err = i.server.Shutdown(ctx)
		if err != nil {
			fmt.Println("Failed to shut down server gracefully.", err)
		}
	}
}
