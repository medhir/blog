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
	"github.com/medhir/blog/server/auth"
	"github.com/medhir/blog/server/storage/gcs"
	"github.com/pkg/errors"
)

// TODO - Move to config
const serverPort = ":9000"
const authHost = "https://auth.medhir.com"

// Instance represents an instance of the server
type Instance struct {
	ctx    context.Context
	router *http.ServeMux
	server *http.Server
	auth   auth.Auth
	gcs    gcs.GCS
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
	return &Instance{
		router: http.DefaultServeMux,
		server: server,
		auth:   auth.NewAuth(fusionauthClient, blogAuthAppID),
		gcs:    gcs,
	}, nil
}

// Start initializes a server instance
func (i *Instance) Start() {
	i.AddRoutes()                    // initialize routes for the ServeMux
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
