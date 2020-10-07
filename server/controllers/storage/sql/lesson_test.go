package sql

import (
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestLesson(t *testing.T) {
	authorID := uuid.New().String()
	masterPVCName := "pvc_name"
	courseTitle := "An amazing course"
	courseDescription := "An amazing course's description"

	// Create course
	courseID, err := pg.CreateCourse(authorID, courseTitle, courseDescription, masterPVCName)
	assert.NoError(t, err)

	lessonTitle := "An amazing lesson"
	lessonMDX := "# An amazing lesson"

	// Create lesson
	lessonID, err := pg.CreateLesson(courseID, lessonTitle, lessonMDX)
	assert.NoError(t, err)

	// Check lesson contents
	lesson, err := pg.GetLesson(lessonID)
	assert.NoError(t, err)
	assert.Equal(t, lessonID, lesson.ID)
	assert.Equal(t, courseID, lesson.CourseID)
	assert.Equal(t, lessonTitle, lesson.Title)
	assert.Equal(t, lessonMDX, lesson.MDX)
	assert.NotEmpty(t, lesson.CreatedAt)
	assert.False(t, lesson.UpdatedAt.Valid)

	lessonTitle = "An amazing updated lesson"
	lessonMDX = "# An amazing updated lesson"

	// Update lesson and check contents
	err = pg.UpdateLesson(lessonID, lessonTitle, lessonMDX)
	assert.NoError(t, err)
	lesson, err = pg.GetLesson(lessonID)
	assert.NoError(t, err)
	assert.Equal(t, lessonID, lesson.ID)
	assert.Equal(t, courseID, lesson.CourseID)
	assert.Equal(t, lessonTitle, lesson.Title)
	assert.Equal(t, lessonMDX, lesson.MDX)
	assert.NotEmpty(t, lesson.CreatedAt)
	assert.True(t, lesson.UpdatedAt.Valid)

	// attempting to delete a course before lesson should return an error
	err = pg.DeleteCourse(courseID)
	assert.Error(t, err)

	// delete lesson
	err = pg.DeleteLesson(lessonID)
	assert.NoError(t, err)

	// confirm lesson is deleted (get lesson for lessonID should return an error)
	_, err = pg.GetLesson(lessonID)
	assert.Error(t, err)

	// deleting a course with no lessons should not return an error
	err = pg.DeleteCourse(courseID)
	assert.NoError(t, err)
}
