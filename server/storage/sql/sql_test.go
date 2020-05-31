package sql

import (
	"fmt"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"log"
	"os"
	"testing"
)
import "github.com/ory/dockertest/v3"

var pg Postgres
var err error

func TestMain(m *testing.M) {
	pool, err := dockertest.NewPool("")
	if err != nil {
		log.Fatalf("Could not connect to docker: %s", err)
	}
	// pull postgres image
	resource, err := pool.Run("postgres", "9.6", []string{"POSTGRES_PASSWORD=docker", "POSTGRES_DB=medhir-com"})
	if err != nil {
		log.Fatalf("Could not start resource: %s", err)
	}

	err = pool.Retry(func() error {
		var err error
		pg, err = NewPostgres(
			fmt.Sprintf("postgres://postgres:docker@localhost:%s/medhir-com?sslmode=disable", resource.GetPort("5432/tcp")),
			"migrations",
		)
		if err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		log.Fatalf("Could not connect to docker: %s", err)
	}

	code := m.Run()
	err = pool.Purge(resource)
	if err != nil {
		log.Fatalf("Could not purge resource: %s", err)
	}

	os.Exit(code)
}

func TestCourses(t *testing.T) {
	course := Course{
		ID:          uuid.New().String(),
		AuthorID:    uuid.New().String(),
		Title:       "An amazing course",
		Description: "An amazing course's description",
	}

	// create a new course
	id, err := pg.CreateCourse(course)
	assert.NoError(t, err)

	// retrieve the newly created course
	courseRecord, err := pg.GetCourse(id)
	createdAtTimestamp := courseRecord.CreatedAt
	assert.NoError(t, err)
	assert.Equal(t, id, courseRecord.ID)
	assert.Equal(t, course.AuthorID, courseRecord.AuthorID)
	assert.Equal(t, course.Title, courseRecord.Title)
	assert.Equal(t, course.Description, courseRecord.Description)
	assert.NotEmpty(t, courseRecord.CreatedAt)
	assert.False(t, courseRecord.UpdatedAt.Valid)

	// update the course
	course.ID = id
	course.Title = "An updated title"
	course.Description = "An updated description"

	err = pg.UpdateCourse(course)
	assert.NoError(t, err)

	courseRecord, err = pg.GetCourse(id)
	assert.Equal(t, id, courseRecord.ID)
	assert.Equal(t, course.AuthorID, courseRecord.AuthorID)
	assert.Equal(t, course.Title, courseRecord.Title)
	assert.Equal(t, course.Description, courseRecord.Description)
	assert.NotEmpty(t, courseRecord.CreatedAt)
	assert.Equal(t, createdAtTimestamp, courseRecord.CreatedAt)
	assert.NotEmpty(t, courseRecord.UpdatedAt.Time)
	assert.True(t, courseRecord.UpdatedAt.Valid)

	// delete the course
	err = pg.DeleteCourse(id)
	assert.NoError(t, err)

	// verify the course no longer exists
	_, err = pg.GetCourse(id)
	assert.Error(t, err)
}
