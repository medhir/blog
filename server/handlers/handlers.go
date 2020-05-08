package handlers

import (
	"encoding/json"
	"fmt"
	"gitlab.medhir.com/medhir/blog/server/coder"
	"gitlab.medhir.com/medhir/blog/server/imageprocessor"
	"net/http"

	"gitlab.medhir.com/medhir/blog/server/auth"
	"gitlab.medhir.com/medhir/blog/server/blog"
	"gitlab.medhir.com/medhir/blog/server/storage/gcs"
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
	PostDraft() http.HandlerFunc
	PatchDraft() http.HandlerFunc
	HandleDraft() http.HandlerFunc
	GetPost() http.HandlerFunc
	GetPosts() http.HandlerFunc

	// Photos
	GetPhotos() http.HandlerFunc
	PostPhoto() http.HandlerFunc
	DeletePhoto() http.HandlerFunc
	HandlePhoto() http.HandlerFunc

	// Coder
	CreateCoderInstance() http.HandlerFunc
}

// handlers describes dependencies needed to serve http requests
type handlers struct {
	dev          bool
	auth         auth.Auth
	gcs          gcs.GCS
	blog         blog.Blog
	imgProcessor imageprocessor.ImageProcessor
	coder        coder.Manager
	env          string
}

// NewHandlers instantiates a new set of handlers
func NewHandlers(auth auth.Auth, gcs gcs.GCS, env string) Handlers {
	return &handlers{
		auth:         auth,
		gcs:          gcs,
		blog:         blog.NewBlog(gcs),
		imgProcessor: imageprocessor.NewImageProcessor(),
		env:          env,
	}
}

// sendJSON writes an encoded json byte slice to an http response
func sendJSON(w http.ResponseWriter, data []byte) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

// writeJSON encodes an interface as JSON and writes the data as part of an http response
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
