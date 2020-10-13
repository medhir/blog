package sql

import (
	"database/sql"
	"errors"
	uuid2 "github.com/google/uuid"
	"time"
)

// Lesson describes the metadata for a course lesson
type Lesson struct {
	ID        string       `json:"id"`
	CourseID  string       `json:"course_id"`
	Title     string       `json:"title"`
	MDX       string       `json:"mdx"`
	Position  int64        `json:"position"`
	CreatedAt time.Time    `json:"created_at"`
	UpdatedAt sql.NullTime `json:"updated_at"`
}

func (p *postgres) CreateLesson(
	courseID string,
	title string,
	mdx string,
	position int64,
) (string, error) {
	id := uuid2.New().String()
	query := `
INSERT INTO lesson (id, course_id, title, mdx, position, created_at)
VALUES ($1, $2, $3, $4, $5, $6);`
	_, err := p.db.Exec(query, id, courseID, title, mdx, position, time.Now())
	if err != nil {
		return "", err
	}
	return id, nil
}

func (p *postgres) GetLesson(id string) (*Lesson, error) {
	lesson := &Lesson{}
	query := `
SELECT id, course_id, title, mdx, created_at, updated_at
FROM lesson
WHERE id = $1;`
	err := p.db.QueryRow(query, id).Scan(
		&lesson.ID,
		&lesson.CourseID,
		&lesson.Title,
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
	mdx string,
) error {
	query := `
UPDATE lesson
SET title = $2, mdx = $3, updated_at = $4
WHERE id = $1;`
	_, err := p.db.Exec(query, id, title, mdx, time.Now())
	if err != nil {
		return err
	}
	return nil
}

func (p *postgres) DeleteLesson(id string) error {
	query := `
DELETE FROM lesson
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
SELECT id, course_id, title, position, created_at, updated_at
FROM lesson
WHERE course_id = $1
ORDER BY position;`
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
			&lesson.Position,
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

func (p *postgres) CountLessons(courseID string) (count int64, _ error) {
	query := `
SELECT COUNT(*) AS count 
FROM lesson
WHERE course_id = $1;
`
	err := p.db.QueryRow(query, courseID).Scan(&count)
	if err != nil {
		return 0, err
	}
	return count, nil
}
