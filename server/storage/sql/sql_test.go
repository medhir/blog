package sql

import (
	"fmt"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"log"
	"os"
	"testing"
)

const databaseName = "medhir-com"

var pg Postgres
var err error

func TestMain(m *testing.M) {
	// init database connection
	host, ok := os.LookupEnv("POSTGRES_HOST")
	if !ok {
		log.Fatal("POSTGRES_HOST must be provided")
	}
	port, ok := os.LookupEnv("POSTGRES_PORT")
	if !ok {
		log.Fatal("POSTGRES_PORT must be provided")
	}
	user, ok := os.LookupEnv("POSTGRES_USER")
	if !ok {
		log.Fatal("POSTGRES_USER must be provided")
	}
	password, ok := os.LookupEnv("POSTGRES_PASSWORD")
	if !ok {
		log.Fatal("POSTGRES_PASSWORD must be provided")
	}
	pg, err = NewPostgres(
		fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", user, password, host, port, databaseName),
		"migrations",
	)
	if err != nil {
		log.Fatalf("Could not connect to database, %s", err)
	}

	code := m.Run()

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
