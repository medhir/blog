package tutorial

import (
	"database/sql"
	db "gitlab.com/medhir/blog/server/controllers/storage/sql"
	"time"
)

// Lesson describes the data for a lesson
type Lesson struct {
	ID              string               `json:"id"`
	CourseID        string               `json:"course_id"`
	Title           string               `json:"title"`
	MDX             string               `json:"mdx"`
	Position        int64                `json:"position"`
	FolderName      string               `json:"folder_name,omitempty"`
	CreatedAt       time.Time            `json:"created_at"`
	UpdatedAt       time.Time            `json:"updated_at,omitempty"`
	InstanceURL     string               `json:"instance_url"`
	LessonsMetadata []*db.LessonMetadata `json:"lessons_metadata"`
}

func (t *tutorials) CreateLesson(courseID, title, mdx string) (string, error) {
	// get lessons for course to determine the position for the next lesson
	lessons, err := t.db.GetLessons(courseID)
	if err != nil {
		return "", err
	}
	var position int64
	if len(lessons) == 0 {
		position = 0
	} else {
		position = lessons[len(lessons)-1].Position + 1
	}
	// create lesson at the latest position
	id, err := t.db.CreateLesson(courseID, title, mdx, position)
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
	lessonsMetadata, err := t.db.GetLessonsMetadata(row.CourseID)
	if err != nil {
		return nil, err
	}
	lesson := &Lesson{
		ID:              row.ID,
		CourseID:        row.CourseID,
		Title:           row.Title,
		MDX:             row.MDX,
		Position:        row.Position,
		CreatedAt:       row.CreatedAt,
		LessonsMetadata: lessonsMetadata,
	}
	if row.FolderName.Valid == true {
		lesson.FolderName = row.FolderName.String
	}
	if row.UpdatedAt.Valid == true {
		lesson.UpdatedAt = row.UpdatedAt.Time
	}
	return lesson, nil
}
func (t *tutorials) UpdateLesson(lessonID, title, mdx, folderName string) error {
	var err error
	if folderName == "" {
		err = t.db.UpdateLesson(lessonID, title, mdx, sql.NullString{
			Valid:  false,
			String: "",
		})
	} else {
		err = t.db.UpdateLesson(lessonID, title, mdx, sql.NullString{
			Valid:  true,
			String: folderName,
		})
	}
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
