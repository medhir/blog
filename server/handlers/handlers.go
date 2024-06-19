package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/medhir/blog/server/controllers/storage/cf"
	muxgo "github.com/muxinc/mux-go"
	"net/http"

	"github.com/medhir/blog/server/controllers/auth"
	"github.com/medhir/blog/server/controllers/blog"
	"github.com/medhir/blog/server/controllers/imageprocessor"
	"github.com/medhir/blog/server/controllers/storage/gcs"
	"github.com/medhir/blog/server/controllers/storage/sql"
)

// Handlers describes all the http handlers available within the package
type Handlers interface {
	// Login Authentication
	Login() http.HandlerFunc
	ValidateJWT() http.HandlerFunc
	RefreshJWT() http.HandlerFunc
	RefreshForNext() http.HandlerFunc
	Authorize(role auth.Role, handler http.HandlerFunc) http.HandlerFunc
	RegisterNewUser() http.HandlerFunc
	HandleResetPassword() http.HandlerFunc
	// Database
	MigrateUp() http.HandlerFunc
	MigrateDown() http.HandlerFunc
	MigrateBlog() http.HandlerFunc
	DatabaseVersion() http.HandlerFunc
	// Blog
	HandleDraft() http.HandlerFunc
	HandlePost() http.HandlerFunc
	GetDrafts() http.HandlerFunc
	GetPosts() http.HandlerFunc
	HandleAsset() http.HandlerFunc
	HandleAssets() http.HandlerFunc
	// Photos
	GetPhotos() http.HandlerFunc
	PostPhoto() http.HandlerFunc
	DeletePhoto() http.HandlerFunc
	HandlePhotos() http.HandlerFunc
	// Videos
	HandleVideo() http.HandlerFunc
	// Media
	HandleMedia() http.HandlerFunc
}

// handlers describes dependencies needed to serve http requests
type handlers struct {
	ctx          context.Context
	dev          bool
	auth         auth.Auth
	gcs          gcs.GCS
	blog         blog.Blog
	imgProcessor imageprocessor.ImageProcessor
	db           sql.Postgres
	cf           cf.CF
	video        *muxgo.APIClient
	env          string
}

const unimplementedHttpHandlerMessage = "unimplemented http handler for method %s"

// NewHandlers instantiates a new set of handlers
func NewHandlers(ctx context.Context, auth auth.Auth, gcs gcs.GCS, cf cf.CF, db sql.Postgres, video *muxgo.APIClient, env string) (Handlers, error) {
	return &handlers{
		ctx:          ctx,
		auth:         auth,
		gcs:          gcs,
		blog:         blog.NewBlog(db, gcs),
		imgProcessor: imageprocessor.NewImageProcessor(),
		db:           db,
		cf:           cf,
		video:        video,
		env:          env,
	}, nil
}

// writeJSON encodes an interface as JSON and writes the data as part of an http response
func writeJSON(w http.ResponseWriter, v interface{}) error {
	data, err := json.Marshal(v)
	if err != nil {
		return fmt.Errorf("could not encode json for %v", v)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_, err = w.Write(data)
	if err != nil {
		return err
	}
	return nil
}
