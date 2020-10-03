package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"gitlab.com/medhir/blog/server/controllers/auth"
	"gitlab.com/medhir/blog/server/controllers/blog"
	"gitlab.com/medhir/blog/server/controllers/code"
	"gitlab.com/medhir/blog/server/controllers/imageprocessor"
	"gitlab.com/medhir/blog/server/controllers/storage/gcs"
	"gitlab.com/medhir/blog/server/controllers/storage/sql"
	"gitlab.com/medhir/blog/server/controllers/tutorial"
	"net/http"
)

// Handlers describes all the http handlers available within the package
type Handlers interface {
	// Authentication
	Login() http.HandlerFunc
	ValidateJWT() http.HandlerFunc
	RefreshJWT() http.HandlerFunc
	RefreshForNext() http.HandlerFunc
	Authorize(role auth.Role, handler http.HandlerFunc) http.HandlerFunc
	RegisterNewUser() http.HandlerFunc
	// Database
	MigrateUp() http.HandlerFunc
	MigrateDown() http.HandlerFunc
	MigrateBlog() http.HandlerFunc
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
	// Courses
	HandleCourse() http.HandlerFunc
	HandleCourses() http.HandlerFunc
	// Lessons
	HandleLesson() http.HandlerFunc
	// Code Instances
	HandleCodeInstance() http.HandlerFunc
}

// handlers describes dependencies needed to serve http requests
type handlers struct {
	ctx          context.Context
	dev          bool
	auth         auth.Auth
	gcs          gcs.GCS
	blog         blog.Blog
	imgProcessor imageprocessor.ImageProcessor
	code         code.Manager
	tutorials    tutorial.Tutorials
	db           sql.Postgres
	env          string
}

// NewHandlers instantiates a new set of handlers
func NewHandlers(ctx context.Context, auth auth.Auth, gcs gcs.GCS, db sql.Postgres, env string) (Handlers, error) {
	codeManager, err := code.NewManager(ctx, auth, env)
	if err != nil {
		return nil, err
	}
	tutorials, err := tutorial.NewTutorials(db, gcs, codeManager)
	if err != nil {
		return nil, err
	}
	return &handlers{
		ctx:          ctx,
		auth:         auth,
		gcs:          gcs,
		blog:         blog.NewBlog(db, gcs),
		imgProcessor: imageprocessor.NewImageProcessor(),
		code:         codeManager,
		tutorials:    tutorials,
		db:           db,
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
