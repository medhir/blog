package server

// based on https://medium.com/@niondir/my-go-http-server-best-practice-a29773786e15

import (
	"context"
	"fmt"
	"net/http"
	"net/url"
	"time"

	"github.com/FusionAuth/go-client/pkg/fusionauth"
)

// TODO - Move to config
const serverPort = "80"
const authHost = "https://auth.medhir.com"

// Instance represents an instance of the server
type Instance struct {
	ctx     context.Context
	router  *http.ServeMux
	server  *http.Server
	auth    *fusionauth.FusionAuthClient
	storage interface{} // TODO - Add a gcs storage client
}

// NewInstance returns a new instance of the server
func NewInstance() (*Instance, error) {
	authBaseURL, err := url.Parse(authHost)
	if err != nil {
		return nil, err
	}
	return &Instance{
		router: http.NewServeMux(),
		auth:   fusionauth.NewClient(nil, authBaseURL, ""),
	}, nil
}

// Start initializes a server instance
func (s *Instance) Start() {
	s.AddRoutes() // initialize routes for the ServeMux
	s.ctx = context.Background()
	s.server = &http.Server{
		Addr: serverPort,
	}
	err := s.server.ListenAndServe() // Start doesn't return until the server connection breaks
	if err != nil {
		fmt.Println("Server stopped unexpectedly.", err)
		s.Shutdown() // gracefully shut down on exit
	}
}

// Shutdown gracefully shuts down a server instance
func (s *Instance) Shutdown() {
	if s.server != nil {
		ctx, cancel := context.WithTimeout(s.ctx, 10*time.Second)
		defer cancel()
		err := s.server.Shutdown(ctx)
		if err != nil {
			fmt.Println("Failed to shut down server gracefully.", err)
		}
	}
}
