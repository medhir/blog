package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/medhir/blog/server/auth"
	"github.com/medhir/blog/server/blog"
	"github.com/medhir/blog/server/storage/gcs"
)

// Handlers describes all the http handlers available within the package
type Handlers interface {
	// Authentication
	Login() http.HandlerFunc
	ValidateJWT() http.HandlerFunc
	Authorize(handler http.HandlerFunc) http.HandlerFunc

	// Blog
	GetDraft() http.HandlerFunc
	GetDrafts() http.HandlerFunc
	GetPost() http.HandlerFunc
	GetPosts() http.HandlerFunc

	// Photos
	GetPhotos() http.HandlerFunc
}

// handlers describes dependencies needed to serve http requests
type handlers struct {
	auth auth.Auth
	gcs  gcs.GCS
	blog blog.Blog
}

// NewHandlers instantiates a new set of handlers
func NewHandlers(auth auth.Auth, gcs gcs.GCS) Handlers {
	return &handlers{
		auth: auth,
		gcs:  gcs,
		blog: blog.NewBlog(gcs),
	}
}

func setJSON(w http.ResponseWriter, data []byte) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

// writeJSON writes the passed in interface to an http response as JSON
func writeJSON(w http.ResponseWriter, v interface{}) error {
	data, err := json.Marshal(v)
	if err != nil {
		return fmt.Errorf("Could not encode json for %v", v)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(data)
	return nil
}
