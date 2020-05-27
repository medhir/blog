package instance

// based on https://medium.com/@niondir/my-go-http-server-best-practice-a29773786e15

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"gitlab.com/medhir/blog/server/auth"
	"gitlab.com/medhir/blog/server/storage/gcs"
	"net/http"
	"os"
	"time"

	"github.com/honeycombio/beeline-go"
	"github.com/honeycombio/beeline-go/wrappers/hnynethttp"
	"github.com/rs/cors"

	// pq is the database driver for connecting to postgres
	_ "github.com/lib/pq"
)

const (
	// TODO - Move to config
	serverPort  = ":9000"
	local       = "local"
	serviceName = "go-server"
)

// Instance represents an instance of the server
type Instance struct {
	ctx    context.Context
	router *http.ServeMux
	server *http.Server
	auth   auth.Auth
	gcs    gcs.GCS
	db     *sql.DB
	env    string
}

// NewInstance returns a new instance of the server
func NewInstance() (*Instance, error) {
	ctx := context.Background()
	server := &http.Server{
		Addr: serverPort,
	}

	gcs, err := gcs.NewGCS(ctx)
	if err != nil {
		return nil, err
	}

	auth, err := auth.NewAuth()
	if err != nil {
		return nil, err
	}

	// get environment
	var environment string
	environment, ok := os.LookupEnv("ENVIRONMENT")
	if !ok {
		environment = local
	}

	// send data to honeycomb
	apiKey, ok := os.LookupEnv("HONEYCOMB_API_KEY")
	if !ok {
		return nil, errors.New("HONEYCOMB_API_KEY must be provided")
	}
	dataset, ok := os.LookupEnv("HONEYCOMB_DATASET")
	if !ok {
		return nil, errors.New("HONEYCOMB_DATASET must be provided")
	}
	beeline.Init(beeline.Config{
		WriteKey:    apiKey,
		Dataset:     dataset,
		ServiceName: serviceName,
	})

	instance := &Instance{
		ctx:    ctx,
		router: http.DefaultServeMux,
		server: server,
		auth:   auth,
		gcs:    gcs,
		env:    environment,
	}

	err = instance.AddRoutes() // initialize routes for serve mux
	if err != nil {
		return nil, err
	}

	// enable CORS
	if environment == local {
		// dev mode
		c := cors.New(cors.Options{
			AllowedOrigins:   []string{"http://localhost:3000", "http://127.0.0.1:3000"},
			Debug:            true,
			AllowCredentials: true,
			AllowedMethods:   []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete},
			AllowedHeaders:   []string{"Authorization", "Content-Type", "Set-Cookie"}})
		instance.server.Handler = hnynethttp.WrapHandler(c.Handler(instance.router))
	} else {
		c := cors.New(cors.Options{
			AllowedOrigins:   []string{"https://review.medhir.com", "https://medhir.com"},
			Debug:            true,
			AllowCredentials: true,
			AllowedMethods:   []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete},
			AllowedHeaders:   []string{"Authorization", "Content-Type", "Set-Cookie"}})
		instance.server.Handler = hnynethttp.WrapHandler(c.Handler(instance.router))
	}

	return instance, nil
}

// Start initializes a server instance
func (i *Instance) Start() {
	// start connection to database
	db, err := sql.Open(
		"postgres",
		fmt.Sprintf(
			"host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
			"localhost",  // host
			5432,         // port
			"postgres",   // user
			"docker",     // password
			"medhir-com", // database name
		),
	)
	if err != nil {
		fmt.Println("Could not start connection to the database -", err.Error())
		i.Shutdown() // gracefully shut down on exit
	}
	defer db.Close()
	// ping db to check connection
	err = db.Ping()
	i.db = db
	err = i.server.ListenAndServe() // Start doesn't return until the server connection breaks
	if err != nil {
		fmt.Println("Server stopped unexpectedly.", err)
		i.Shutdown()
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
