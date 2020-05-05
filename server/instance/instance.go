package instance

// based on https://medium.com/@niondir/my-go-http-server-best-practice-a29773786e15

import (
	"context"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/FusionAuth/go-client/pkg/fusionauth"
	"github.com/pkg/errors"
	"github.com/rs/cors"
	"gitlab.medhir.com/medhir/blog/server/auth"
	"gitlab.medhir.com/medhir/blog/server/storage/gcs"
)

const (
	// TODO - Move to config
	serverPort = ":9000"
	authHost   = "https://auth.medhir.com"
	local      = "local"
)

// Instance represents an instance of the server
type Instance struct {
	ctx    context.Context
	router *http.ServeMux
	server *http.Server
	auth   auth.Auth
	gcs    gcs.GCS
	env    string
}

// NewInstance returns a new instance of the server
func NewInstance() (*Instance, error) {
	ctx := context.Background()
	authBaseURL, err := url.Parse(authHost)
	if err != nil {
		return nil, err
	}
	server := &http.Server{
		Addr: serverPort,
	}
	httpClient := &http.Client{
		Timeout: 30 * time.Second,
	}
	fusionauthAPIKey, ok := os.LookupEnv("FUSIONAUTH_API_KEY")
	if !ok {
		return nil, errors.New("unable to look up fusionauth api key")
	}
	blogAuthAppID, ok := os.LookupEnv("BLOG_AUTH_APPLICATION_ID")
	if !ok {
		return nil, errors.New("unable to look up fusionauth application ID")
	}
	fusionauthClient := fusionauth.NewClient(httpClient, authBaseURL, fusionauthAPIKey)
	gcs, err := gcs.NewGCS(ctx)
	if err != nil {
		return nil, err
	}

	// get environment
	var environment string
	environment, ok = os.LookupEnv("ENVIRONMENT")
	if !ok {
		environment = local
	}

	instance := &Instance{
		router: http.DefaultServeMux,
		server: server,
		auth:   auth.NewAuth(fusionauthClient, blogAuthAppID),
		gcs:    gcs,
		env:    environment,
	}
	instance.AddRoutes() // initialize routes for serve mux

	// enable CORS
	if environment == local {
		// dev mode
		c := cors.New(cors.Options{
			AllowedOrigins:   []string{"http://localhost:3000", "http://127.0.0.1:3000"},
			Debug:            true,
			AllowCredentials: true,
			AllowedMethods:   []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete},
			AllowedHeaders:   []string{"Authorization", "Content-Type", "Set-Cookie"}})
		instance.server.Handler = c.Handler(instance.router)
	} else {
		c := cors.New(cors.Options{
			AllowedOrigins:   []string{"https://review.medhir.com", "https://medhir.com"},
			Debug:            true,
			AllowCredentials: true,
			AllowedMethods:   []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete},
			AllowedHeaders:   []string{"Authorization", "Content-Type", "Set-Cookie"}})
		instance.server.Handler = c.Handler(instance.router)
	}

	return instance, nil
}

// Start initializes a server instance
func (i *Instance) Start() {
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
		err := i.server.Shutdown(ctx)
		if err != nil {
			fmt.Println("Failed to shut down server gracefully.", err)
		}
	}
}
