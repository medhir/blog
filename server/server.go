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

type instance struct {
	ctx     context.Context
	router  *http.ServeMux
	server  *http.Server
	auth    *fusionauth.FusionAuthClient
	storage interface{} // TODO - Add a gcs storage client
}

// NewInstance returns a new instance of the server
func NewInstance() (*instance, error) {
	authBaseURL, err := url.Parse(authHost)
	if err != nil {
		return nil, err
	}
	return &instance{
		router: http.NewServeMux(),
		auth:   fusionauth.NewClient(nil, authBaseURL, ""),
	}, nil
}

func (s *instance) Start() {
	s.addRoutes() // initialize routes for the ServeMux
	s.ctx = context.Background()
	s.server = &http.Server{
		Addr: "80",
	}
	err := s.server.ListenAndServe() // Start doesn't return until the server connection breaks
	if err != nil {
		fmt.Println("Server stopped unexpectedly.", err)
		s.Shutdown() // gracefully shut down on exit
	}
}

func (s *instance) Shutdown() {
	if s.server != nil {
		ctx, cancel := context.WithTimeout(s.ctx, 10*time.Second)
		defer cancel()
		err := s.server.Shutdown(ctx)
		if err != nil {
			fmt.Println("Failed to shut down server gracefully.", err)
		}
	}
}
