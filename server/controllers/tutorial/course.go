package tutorial

import (
	"fmt"
	uuid2 "github.com/google/uuid"
	"time"
)

// Course describes the metadata for a course
type Course struct {
	ID            string    `json:"id"`
	AuthorID      string    `json:"author_id"`
	Title         string    `json:"title"`
	Description   string    `json:"description"`
	MasterPVCName string    `json:"master_pvc_name"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at,omitempty"`
}

func (t *tutorials) CreateCourse(authorID, title, description string) (id string, _ error) {
	pvcName := fmt.Sprintf("medhir-com-course-%s", uuid2.New().String())
	err := t.code.CreatePVC(pvcName, "15Gi")
	id, err = t.db.CreateCourse(authorID, title, description, pvcName)
	if err != nil {
		return "", err
	}
	return id, nil
}

func (t *tutorials) GetCourse(courseID string) (*Course, error) {
	row, err := t.db.GetCourse(courseID)
	if err != nil {
		return nil, err
	}
	course := &Course{
		ID:            row.ID,
		AuthorID:      row.AuthorID,
		Title:         row.Title,
		Description:   row.Description,
		MasterPVCName: row.MasterPVCName,
		CreatedAt:     row.CreatedAt,
	}
	if row.UpdatedAt.Valid == true {
		course.UpdatedAt = row.UpdatedAt.Time
	}
	return course, nil
}

func (t *tutorials) UpdateCourse(id, title, description string) error {
	err := t.db.UpdateCourse(id, title, description)
	if err != nil {
		return err
	}
	return nil
}

func (t *tutorials) DeleteCourse(id string) error {
	course, err := t.db.GetCourse(id)
	if err != nil {
		return err
	}
	err = t.db.DeleteCourse(id)
	if err != nil {
		return err
	}
	err = t.code.DeletePVC(course.MasterPVCName)
	if err != nil {
		return err
	}
	return nil
}

func (t *tutorials) GetCourses(authorID string) ([]*Course, error) {
	rows, err := t.db.GetCourses(authorID)
	if err != nil {
		return nil, err
	}
	var courses []*Course
	for _, row := range rows {
		course := &Course{
			ID:            row.ID,
			AuthorID:      row.AuthorID,
			Title:         row.Title,
			Description:   row.Description,
			MasterPVCName: row.MasterPVCName,
			CreatedAt:     row.CreatedAt,
		}
		if row.UpdatedAt.Valid == true {
			course.UpdatedAt = row.UpdatedAt.Time
		}
		courses = append(courses, course)
	}
	return courses, nil
}
