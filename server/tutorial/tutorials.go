package tutorial

import (
	"context"
	"gitlab.com/medhir/blog/server/auth"
	"gitlab.com/medhir/blog/server/code"
	"gitlab.com/medhir/blog/server/storage/gcs"
	"gitlab.com/medhir/blog/server/storage/sql"
)

type Tutorials interface {
	// Course API
	CreateCourse(authorID, title, description string) (id string, _ error)
	GetCourse(courseID string) (*Course, error)
	UpdateCourse(id, title, description string) error
	DeleteCourse(id string) error
	GetCourses(authorID string) ([]*Course, error)
}

type tutorials struct {
	db   sql.Postgres
	code code.Manager
	gcs  gcs.GCS
}

// NewTutorials returns a new tutorials controller
func NewTutorials(ctx context.Context, auth auth.Auth, db sql.Postgres, gcs gcs.GCS, env string) (Tutorials, error) {
	codeManager, err := code.NewManager(ctx, auth, env)
	if err != nil {
		return nil, err
	}
	return &tutorials{
		db:   db,
		code: codeManager,
		gcs:  gcs,
	}, nil
}
