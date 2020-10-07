package tutorial

import (
	"time"
)

// Lesson describes the metadata for a lesson
type Lesson struct {
	ID          string    `json:"id"`
	CourseID    string    `json:"course_id"`
	Title       string    `json:"title"`
	MDX         string    `json:"mdx"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at,omitempty"`
	InstanceURL string    `json:"instance_url"`
}

func (t *tutorials) CreateLesson(courseID, title, mdx string) (string, error) {
	id, err := t.db.CreateLesson(courseID, title, mdx)
	if err != nil {
		return "", err
	}
	return id, nil
}

func (t *tutorials) GetLesson(lessonID string) (*Lesson, error) {
	row, err := t.db.GetLesson(lessonID)
	if err != nil {
		return nil, err
	}
	lesson := &Lesson{
		ID:        row.ID,
		CourseID:  row.CourseID,
		Title:     row.Title,
		MDX:       row.MDX,
		CreatedAt: row.CreatedAt,
	}
	if row.UpdatedAt.Valid == true {
		lesson.UpdatedAt = row.UpdatedAt.Time
	}
	return lesson, nil
}
func (t *tutorials) UpdateLesson(lessonID, title, mdx string) error {
	err := t.db.UpdateLesson(lessonID, title, mdx)
	if err != nil {
		return err
	}
	return nil
}
func (t *tutorials) DeleteLesson(lessonID string) error {
	err := t.db.DeleteLesson(lessonID)
	if err != nil {
		return err
	}
	return nil
}
func (t *tutorials) GetLessons(courseID string) ([]*Lesson, error) {
	rows, err := t.db.GetLessons(courseID)
	if err != nil {
		return nil, err
	}
	var lessons []*Lesson
	for _, row := range rows {
		lesson := &Lesson{
			ID:        row.ID,
			CourseID:  row.CourseID,
			Title:     row.Title,
			MDX:       row.MDX,
			CreatedAt: row.CreatedAt,
		}
		if row.UpdatedAt.Valid == true {
			lesson.UpdatedAt = row.UpdatedAt.Time
		}
		lessons = append(lessons, lesson)
	}
	return lessons, nil
}
