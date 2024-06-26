package sql

import (
	"database/sql"
	"errors"
	uuid2 "github.com/google/uuid"
	"time"
)

// Lesson describes the data associated with a course lesson
type Lesson struct {
	ID         string         `json:"id"`
	CourseID   string         `json:"course_id"`
	Title      string         `json:"title"`
	MDX        string         `json:"mdx"`
	FolderName sql.NullString `json:"folder_name"`
	Position   int64          `json:"position"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  sql.NullTime   `json:"updated_at"`
}

// LessonAsset describes the metadata for a lesson image asset
type LessonAsset struct {
	LessonID string `json:"lesson_id"`
	Name     string `json:"name"`
	URL      string `json:"url"`
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
SELECT id, course_id, title, mdx, folder_name, position, created_at, updated_at
FROM lesson
WHERE id = $1;`
	err := p.db.QueryRow(query, id).Scan(
		&lesson.ID,
		&lesson.CourseID,
		&lesson.Title,
		&lesson.MDX,
		&lesson.FolderName,
		&lesson.Position,
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
	folderName sql.NullString,
) error {
	query := `
UPDATE lesson
SET title = $2, mdx = $3, folder_name = $4, updated_at = $5
WHERE id = $1;`
	_, err := p.db.Exec(query, id, title, mdx, folderName, time.Now())
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

// LessonMetadata describes metadata for a lesson
type LessonMetadata struct {
	ID    string `json:"id"`
	Title string `json:"title"`
}

func (p *postgres) GetLessonsMetadata(courseID string) ([]*LessonMetadata, error) {
	query := `
SELECT id, title
FROM lesson
WHERE course_id = $1
ORDER BY position;`

	rows, err := p.db.Query(query, courseID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var lessons []*LessonMetadata
	for rows.Next() {
		lesson := &LessonMetadata{}
		err := rows.Scan(
			&lesson.ID,
			&lesson.Title,
		)
		if err != nil {
			return nil, err
		}
		lessons = append(lessons, lesson)
	}
	return lessons, nil
}

func (p *postgres) AddLessonAsset(lessonID, name, url string) error {
	query := `
INSERT INTO LessonAsset (lesson_id, name, url)
VALUES ($1, $2, $3);
`
	_, err := p.db.Exec(query, lessonID, name, url)
	if err != nil {
		return err
	}
	return nil
}

func (p *postgres) DeleteLessonAsset(lessonID, name string) error {
	query := `
DELETE FROM LessonAsset
WHERE lesson_id = $1 AND name = $2;
`
	res, err := p.db.Exec(query, lessonID, name)
	if err != nil {
		return err
	}
	count, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if count == 0 {
		return errors.New("lesson asset was not deleted, zero rows affected by delete query")
	}
	return nil
}

func (p *postgres) GetLessonAssets(lessonID string) ([]*LessonAsset, error) {
	query := `
SELECT lesson_id, name, url
FROM LessonAsset
WHERE lesson_id = $1;
`
	rows, err := p.db.Query(query, lessonID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var assets []*LessonAsset
	for rows.Next() {
		asset := &LessonAsset{}
		err := rows.Scan(
			&asset.LessonID,
			&asset.Name,
			&asset.URL,
		)
		if err != nil {
			return nil, err
		}
		assets = append(assets, asset)
	}
	return assets, nil
}
