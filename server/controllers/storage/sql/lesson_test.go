package sql

import (
	"database/sql"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestLesson(t *testing.T) {
	authorID := uuid.New().String()
	masterPVCName := "pvc_name"
	courseTitle := "An amazing course"
	courseDescription := "An amazing course's description"

	// create user
	err := pg.CreateUser(authorID, "bob", "bob@gmail.com")

	// Create course
	courseID, err := pg.CreateCourse(authorID, courseTitle, courseDescription, masterPVCName)
	assert.NoError(t, err)

	lessonTitle := "An amazing lesson"
	lessonMDX := "# An amazing lesson"
	lessonPosition := int64(0)

	// Create lesson
	lessonID, err := pg.CreateLesson(courseID, lessonTitle, lessonMDX, lessonPosition)
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
	assert.Equal(t, lessonPosition, lesson.Position)

	lessonTitle = "An amazing updated lesson"
	lessonMDX = "# An amazing updated lesson"

	// Update lesson and check contents
	err = pg.UpdateLesson(lessonID, lessonTitle, lessonMDX, sql.NullString{
		Valid:  false,
		String: "",
	})
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

	// delete user
	err = pg.DeleteUser(authorID)
	assert.NoError(t, err)
}

func TestLessonAsset(t *testing.T) {
	authorID := uuid.New().String()
	masterPVCName := "pvc_name"
	courseTitle := "An amazing course"
	courseDescription := "An amazing course's description"

	// create user
	err := pg.CreateUser(authorID, "bob", "bob@gmail.com")

	// Create course
	courseID, err := pg.CreateCourse(authorID, courseTitle, courseDescription, masterPVCName)
	assert.NoError(t, err)

	lessonTitle := "An amazing lesson"
	lessonMDX := "# An amazing lesson"

	// Create lesson
	lessonID, err := pg.CreateLesson(courseID, lessonTitle, lessonMDX, 0)
	assert.NoError(t, err)

	// Add asset
	assetName := "an/asset/name"
	assetURL := "https://asset.org/asset/name"

	err = pg.AddLessonAsset(lessonID, assetName, assetURL)
	assert.NoError(t, err)

	// Get assets
	assets, err := pg.GetLessonAssets(lessonID)
	assert.NoError(t, err)
	assert.Equal(t, 1, len(assets))
	assert.Equal(t, assetName, assets[0].Name)
	assert.Equal(t, assetURL, assets[0].URL)

	// lesson should not delete if assets are attached
	err = pg.DeleteLesson(lessonID)
	assert.Error(t, err)

	// delete asset
	err = pg.DeleteLessonAsset(lessonID, assetName)
	assert.NoError(t, err)
	assets, err = pg.GetLessonAssets(lessonID)
	assert.NoError(t, err)
	assert.Equal(t, 0, len(assets))

	// lesson should be able to be deleted once assets are deleted
	err = pg.DeleteLesson(lessonID)
	assert.NoError(t, err)

	// deleting a course with no lessons should not return an error
	err = pg.DeleteCourse(courseID)
	assert.NoError(t, err)

	// delete user
	err = pg.DeleteUser(authorID)
	assert.NoError(t, err)
}
