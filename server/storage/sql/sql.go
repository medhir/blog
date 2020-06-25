package sql

import (
	"database/sql"
	"fmt"
	"github.com/golang-migrate/migrate/v4"
	// pq is the database driver for connecting to postgres
	_ "github.com/lib/pq"
	// postgres migration driver
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	// migration file reading driver
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

// Postgres is the interface for interacting with the postgres database
type Postgres interface {
	Close() error

	// Course API
	CreateCourse(course Course) (string, error)
	GetCourse(courseID string) (*Course, error)
	UpdateCourse(course Course) error
	DeleteCourse(courseID string) error
	GetCourses(authorID string) ([]*Course, error)

	// Lessons API
	CreateLesson(
		id string,
		courseID string,
		title string,
		description string,
		mdx string,
	) error
	GetLesson(id string) (*Lesson, error)
	UpdateLesson(
		id string,
		title string,
		description string,
		mdx string,
	) error
	DeleteLesson(id string) error
	GetLessons(courseID string) ([]*Lesson, error)
}

type postgres struct {
	db *sql.DB
}

// NewPostgres instantiates a new connection to a postgres database, as well as providing an interface for interacting with the db.
// This is meant to be a long living connection, and must be explicitly closed using the postgres.Close() method upon program exit
func NewPostgres(url, migrationsPath string) (Postgres, error) {
	// start connection to database
	db, err := sql.Open("postgres", url)
	if err != nil {
		return nil, fmt.Errorf("could not start connection to the database - %s", err.Error())
	}
	// ping db to check connection
	err = db.Ping()
	if err != nil {
		return nil, fmt.Errorf("could not connect to the database - %s", err.Error())
	}
	// migrate the database to the latest version
	m, err := migrate.New(fmt.Sprintf("file://%s", migrationsPath), url)
	if err != nil {
		return nil, fmt.Errorf("could not start database migrations - %s", err.Error())
	}
	err = m.Up()
	if err != nil && err != migrate.ErrNoChange {
		return nil, fmt.Errorf("could not migrate the database - %s", err.Error())
	}
	return &postgres{
		db: db,
	}, nil
}

func (p *postgres) Close() error {
	return p.db.Close()
}
