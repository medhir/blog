package tutorial

import (
	"gitlab.com/medhir/blog/server/controllers/code"
	"gitlab.com/medhir/blog/server/controllers/storage/gcs"
	"gitlab.com/medhir/blog/server/controllers/storage/sql"
)

// Tutorials is the API description for how to interact with the tutorials controller
type Tutorials interface {
	// Course API
	CreateCourse(authorID, title, description string) (id string, _ error)
	GetCourse(courseID string) (*Course, error)
	UpdateCourse(id, title, description string) error
	DeleteCourse(id string) error
	GetCourses(authorID string) ([]*Course, error)
	// Lesson API
	CreateLesson(courseID, title, description, mdx string) (string, error)
	GetLesson(lessonID string) (*Lesson, error)
	UpdateLesson(lessonID, title, description, mdx string) error
	DeleteLesson(lessonID string) error
	GetLessons(courseID string) ([]*Lesson, error)
}

type tutorials struct {
	db   sql.Postgres
	code code.Manager
	gcs  gcs.GCS
}

// NewTutorials returns a new tutorials controller
func NewTutorials(db sql.Postgres, gcs gcs.GCS, code code.Manager) (Tutorials, error) {
	return &tutorials{
		db:   db,
		gcs:  gcs,
		code: code,
	}, nil
}
