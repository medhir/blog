package sql

import (
	"errors"
	"time"
)

func courseValid(course Course) error {
	if course.ID == "" {
		return errors.New("course id cannot be empty")
	}
	if course.AuthorID == "" {
		return errors.New("course author id cannot be empty")
	}
	if course.Title == "" {
		return errors.New("course title cannot be empty")
	}
	return nil
}

func (p *postgres) CreateCourse(course Course) (string, error) {
	err := courseValid(course)
	if err != nil {
		return "", err
	}
	query := `
INSERT INTO courses (id, author_id, title, description, created_at)
VALUES ($1, $2, $3, $4, $5)
RETURNING id;`
	var id string
	err = p.db.QueryRow(query, course.ID, course.AuthorID, course.Title, course.Description, time.Now()).Scan(&id)
	if err != nil {
		return "", err
	}
	return id, nil
}

func (p *postgres) GetCourse(courseUUID string) (*Course, error) {
	course := &Course{}
	query := `
SELECT id, author_id, title, description, created_at, updated_at
FROM courses
WHERE id = $1;`
	err := p.db.QueryRow(query, courseUUID).Scan(&course.ID, &course.AuthorID, &course.Title, &course.Description, &course.CreatedAt, &course.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return course, nil
}

func (p *postgres) UpdateCourse(course Course) error {
	err := courseValid(course)
	if err != nil {
		return err
	}
	query := `
UPDATE courses
SET author_id = $2, title = $3, description = $4, updated_at = $5
WHERE id = $1;`
	_, err = p.db.Exec(query, course.ID, course.AuthorID, course.Title, course.Description, time.Now())
	if err != nil {
		return err
	}
	return nil
}

func (p *postgres) DeleteCourse(courseUUID string) error {
	query := `
DELETE FROM courses
WHERE id = $1;`
	res, err := p.db.Exec(query, courseUUID)
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
