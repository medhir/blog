package sql

import (
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestCourses(t *testing.T) {
	authorID := uuid.New().String()
	masterPVCName := "pvc_name"
	title := "An amazing course"
	description := "An amazing course's description"

	// create a new course
	id, err := pg.CreateCourse(authorID, title, description, masterPVCName)
	assert.NotEmpty(t, id)
	assert.NoError(t, err)

	// retrieve the newly created course
	courseRecord, err := pg.GetCourse(id)
	assert.NoError(t, err)
	assert.Equal(t, id, courseRecord.ID)
	assert.Equal(t, authorID, courseRecord.AuthorID)
	assert.Equal(t, title, courseRecord.Title)
	assert.Equal(t, description, courseRecord.Description)
	assert.NotEmpty(t, courseRecord.CreatedAt)
	assert.False(t, courseRecord.UpdatedAt.Valid)

	// update the course
	title = "An updated title"
	description = "An updated description"

	err = pg.UpdateCourse(id, title, description)
	assert.NoError(t, err)

	courseRecord, err = pg.GetCourse(id)
	assert.NoError(t, err)
	assert.Equal(t, id, courseRecord.ID)
	assert.Equal(t, authorID, courseRecord.AuthorID)
	assert.Equal(t, title, courseRecord.Title)
	assert.Equal(t, description, courseRecord.Description)
	assert.NotEmpty(t, courseRecord.CreatedAt)
	assert.NotEmpty(t, courseRecord.UpdatedAt.Time)
	assert.True(t, courseRecord.UpdatedAt.Valid)

	// delete the course
	err = pg.DeleteCourse(id)
	assert.NoError(t, err)

	// verify the course no longer exists
	_, err = pg.GetCourse(id)
	assert.Error(t, err)
}
