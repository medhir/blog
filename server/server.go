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

const authHost = "https://auth.medhir.com"

type instance struct {
	router  *http.ServeMux
	server  *http.Server
	auth    *fusionauth.FusionAuthClient
	storage string // TODO - Add a storage client interface
}

// NewInstance returns a new instance of the server
func NewInstance() (*instance, error) {
	authBaseURL, err := url.Parse(authHost)
	if err != nil {
		return nil, err
	}
	return &instance{
		router: http.NewServeMux(),
		server: &http.Server{}, // populate these values
		auth:   fusionauth.NewClient(nil, authBaseURL, ""),
	}, nil
}

func (s *instance) Start() {
	s.addRoutes()
	err := s.server.ListenAndServe()
	if err != nil {
		fmt.Println("Server stopped unexpectedly.", err)
		s.Shutdown()
	}
}

func (s *instance) Shutdown() {
	if s.server != nil {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		err := s.server.Shutdown(ctx)
		if err != nil {
			fmt.Println("Failed to shut down server gracefully.", err)
		}
	}
}
