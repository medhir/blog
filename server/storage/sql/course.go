package sql

import (
	"database/sql"
	"errors"
	uuid2 "github.com/google/uuid"
	"time"
)

// Course describes the metadata for a course
type Course struct {
	ID          string       `json:"id"`
	AuthorID    string       `json:"author_id"`
	Title       string       `json:"title"`
	Description string       `json:"description"`
	BucketName  string       `json:"bucket_name"`
	CreatedAt   time.Time    `json:"created_at"`
	UpdatedAt   sql.NullTime `json:"updated_at"`
}

func courseValid(author_id, title string) error {
	if author_id == "" {
		return errors.New("course author id cannot be empty")
	}
	if title == "" {
		return errors.New("course title cannot be empty")
	}
	return nil
}

func (p *postgres) CreateCourse(authorID, title, description, bucketName string) (string, error) {
	err := courseValid(authorID, title)
	if err != nil {
		return "", err
	}
	uuid := uuid2.New().String()
	query := `
INSERT INTO course (id, author_id, title, description, master_bucket_name, created_at)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id;`
	var id string
	err = p.db.QueryRow(query, uuid, authorID, title, description, bucketName, time.Now()).Scan(&id)
	if err != nil {
		return "", err
	}
	return id, nil
}

func (p *postgres) GetCourse(courseID string) (*Course, error) {
	course := &Course{}
	query := `
SELECT id, author_id, title, description, master_bucket_name, created_at, updated_at
FROM course
WHERE id = $1;`
	err := p.db.QueryRow(query, courseID).Scan(
		&course.ID,
		&course.AuthorID,
		&course.Title,
		&course.Description,
		&course.BucketName,
		&course.CreatedAt,
		&course.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return course, nil
}

func (p *postgres) UpdateCourse(id, title, description string) error {
	if title == "" {
		return errors.New("title must not be empty")
	}
	query := `
UPDATE course
SET title = $3, description = $4, updated_at = $5
WHERE id = $1;`
	_, err := p.db.Exec(query, id, title, description, time.Now())
	if err != nil {
		return err
	}
	return nil
}

func (p *postgres) DeleteCourse(courseID string) error {
	query := `
DELETE FROM course
WHERE id = $1;`
	res, err := p.db.Exec(query, courseID)
	if err != nil {
		return err
	}
	count, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if count == 0 {
		return errors.New("course was not deleted, zero rows affected by delete query")
	}
	return nil
}

func (p *postgres) GetCourses(authorID string) ([]*Course, error) {
	query := `
SELECT id, author_id, title, description, master_bucket_name, created_at, updated_at 
FROM course
WHERE author_id = $1;`
	rows, err := p.db.Query(query, authorID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var courses []*Course
	for rows.Next() {
		course := &Course{}
		err := rows.Scan(
			&course.ID,
			&course.AuthorID,
			&course.Title,
			&course.Description,
			&course.BucketName,
			&course.CreatedAt,
			&course.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		courses = append(courses, course)
	}
	return courses, nil
}
