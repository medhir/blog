package sql

import (
	"database/sql"
	"time"
)

// Course describes the metadata for a course
type Course struct {
	ID          string       `json:"id"`
	AuthorID    string       `json:"author_id"`
	Title       string       `json:"title"`
	Description string       `json:"description"`
	CreatedAt   time.Time    `json:"created_at"`
	UpdatedAt   sql.NullTime `json:"updated_at"`
}

// Lesson describes the metadata for a course lesson
type Lesson struct {
	ID          string       `json:"id"`
	CourseID    string       `json:"course_id"`
	Section     string       `json:"section"`
	Title       string       `json:"title"`
	Description string       `json:"description"`
	MDX         string       `json:"mdx"`
	CreatedAt   time.Time    `json:"created_at"`
	UpdatedAt   sql.NullTime `json:"updated_at"`
}
