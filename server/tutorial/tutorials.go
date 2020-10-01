package tutorial

import (
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
	db  sql.Postgres
	gcs gcs.GCS
}

// NewTutorials returns a new tutorials controller
func NewTutorials(db sql.Postgres, gcs gcs.GCS) Tutorials {
	return &tutorials{
		db:  db,
		gcs: gcs,
	}
}
