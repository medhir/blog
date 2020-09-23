package sql

import (
	"database/sql"
	"errors"
	"time"
)

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

func (p *postgres) CreateLesson(
	id string,
	courseID string,
	title string,
	description string,
	mdx string,
) error {
	query := `
INSERT INTO lessons (id, course_id, section, title, description, mdx, created_at)
VALUES ($1, $2, $3, $4, $5, $6, $7);`
	_, err := p.db.Exec(query, id, courseID, "", title, description, mdx, time.Now())
	if err != nil {
		return err
	}
	return nil
}

func (p *postgres) GetLesson(id string) (*Lesson, error) {
	lesson := &Lesson{}
	query := `
SELECT id, course_id, title, description, mdx, created_at, updated_at
FROM lessons
WHERE id = $1;`
	err := p.db.QueryRow(query, id).Scan(
		&lesson.ID,
		&lesson.CourseID,
		&lesson.Title,
		&lesson.Description,
		&lesson.MDX,
		&lesson.CreatedAt,
		&lesson.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return lesson, nil
}

func (p *postgres) UpdateLesson(
	id string,
	title string,
	description string,
	mdx string,
) error {
	query := `
UPDATE lessons
SET title = $2, description = $3, mdx = $4, updated_at = $5
WHERE id = $1;`
	_, err := p.db.Exec(query, id, title, description, mdx, time.Now())
	if err != nil {
		return err
	}
	return nil
}

func (p *postgres) DeleteLesson(id string) error {
	query := `
DELETE FROM lessons
WHERE id = $1`
	res, err := p.db.Exec(query, id)
	if err != nil {
		return err
	}
	count, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if count == 0 {
		return errors.New("lesson was not deleted, zero rows affected by delete query")
	}
	return nil
}

func (p *postgres) GetLessons(courseID string) ([]*Lesson, error) {
	query := `
SELECT id, course_id, title, description, created_at, updated_at
FROM lessons
WHERE course_id = $1
ORDER BY created_at ASC;`
	rows, err := p.db.Query(query, courseID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var lessons []*Lesson
	for rows.Next() {
		lesson := &Lesson{}
		err := rows.Scan(
			&lesson.ID,
			&lesson.CourseID,
			&lesson.Title,
			&lesson.Description,
			&lesson.CreatedAt,
			&lesson.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		lessons = append(lessons, lesson)
	}
	return lessons, nil
}
