package api

import "net/http"

type api struct {
	Router *http.ServeMux
}

func NewAPI() *api {
	router := http.NewServeMux()
	return &api{
		Router: router,
	}
}
