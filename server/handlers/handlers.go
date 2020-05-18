package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"gitlab.medhir.com/medhir/blog/server/coder"
	"gitlab.medhir.com/medhir/blog/server/imageprocessor"
	"net/http"

	"gitlab.medhir.com/medhir/blog/server/auth"
	"gitlab.medhir.com/medhir/blog/server/blog"
	"gitlab.medhir.com/medhir/blog/server/storage/gcs"
)

const (
	reviewEnv     = "review"
	productionEnv = "production"
)

// Handlers describes all the http handlers available within the package
type Handlers interface {
	// Authentication
	Login() http.HandlerFunc
	ValidateJWT() http.HandlerFunc
	Authorize(role auth.Role, handler http.HandlerFunc) http.HandlerFunc
	RegisterNewUser() http.HandlerFunc

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
	HandleCoder() http.HandlerFunc
}

// handlers describes dependencies needed to serve http requests
type handlers struct {
	ctx          context.Context
	dev          bool
	auth         auth.Auth
	gcs          gcs.GCS
	blog         blog.Blog
	imgProcessor imageprocessor.ImageProcessor
	coder        coder.Manager
	env          string
}

// NewHandlers instantiates a new set of handlers
func NewHandlers(ctx context.Context, auth auth.Auth, gcs gcs.GCS, env string) (Handlers, error) {
	var dev bool
	if env == reviewEnv || env == productionEnv {
		dev = false
	} else {
		dev = true
	}
	coderManager, err := coder.NewManager(ctx, dev)
	if err != nil {
		return nil, err
	}
	return &handlers{
		ctx:          ctx,
		auth:         auth,
		gcs:          gcs,
		blog:         blog.NewBlog(gcs),
		imgProcessor: imageprocessor.NewImageProcessor(),
		coder:        coderManager,
		env:          env,
	}, nil
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
