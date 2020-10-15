package sql

import (
	"database/sql"
	"fmt"
	"github.com/golang-migrate/migrate/v4"
	"time"

	// pq is the database driver for connecting to postgres
	_ "github.com/lib/pq"
	// postgres migration driver
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	// migration file reading driver
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

// Postgres is the interface for interacting with the postgres database
type Postgres interface {
	MigrateUp() error
	MigrateDown() error
	MigrateUpAll() error
	Version() (uint, bool, error)
	Close() error

	// Course API
	CreateCourse(authorID, title, description, pvcName string) (string, error)
	GetCourse(courseID string) (*Course, error)
	UpdateCourse(id, title, description string) error
	DeleteCourse(courseID string) error
	GetCourses(authorID string) ([]*Course, error)

	// Lessons API
	CreateLesson(
		courseID string,
		title string,
		mdx string,
		position int64,
	) (string, error)
	GetLesson(id string) (*Lesson, error)
	UpdateLesson(
		id string,
		title string,
		mdx string,
		folderName sql.NullString,
	) error
	DeleteLesson(id string) error
	GetLessons(courseID string) ([]*Lesson, error)
	GetLessonsMetadata(courseID string) ([]*LessonMetadata, error)
	CountLessons(courseID string) (count int64, _ error)

	// Blog API
	AddDraftOrPost(
		id string,
		title string,
		markdown string,
		createdOn time.Time,
		savedOn sql.NullTime,
		publishedOn sql.NullTime,
	) error
	CreateDraft(title string, markdown string) (id string, _ error)
	GetDraft(id string) (*BlogPost, error)
	SaveDraft(
		id string,
		title string,
		markdown string,
	) error
	DeleteDraftOrPost(id string) error
	GetDrafts() ([]*BlogPost, error)

	PublishPost(id string) error
	GetPost(id string) (*BlogPost, error)
	GetPostBySlug(slug string) (*BlogPost, error)
	RevisePost(
		id string,
		title string,
		markdown string,
	) error
	GetPosts() ([]*BlogPost, error)

	AddAsset(
		postID string,
		name string,
		url string,
	) error
	DeleteAsset(
		postID string,
		name string,
	) error
	GetAssets(postID string) ([]*BlogPostAsset, error)
}

type postgres struct {
	db       *sql.DB
	migrator *migrate.Migrate
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
	return &postgres{
		db:       db,
		migrator: m,
	}, nil
}

// MigrateUp migrates the postgres instance to the next version by one step
func (p *postgres) MigrateUp() error {
	err := p.migrator.Steps(1)
	if err != nil && err != migrate.ErrNoChange {
		return fmt.Errorf("could not migrate the database - %s", err.Error())
	}
	return nil
}

// MigrateDown migrates the postgres instance to the previous version by one step
func (p *postgres) MigrateDown() error {
	err := p.migrator.Steps(-1)
	if err != nil && err != migrate.ErrNoChange {
		return fmt.Errorf("could not migrate the database - %s", err.Error())
	}
	return nil
}

// MigrateUpAll migrates the postgres instance to the latest version
func (p *postgres) MigrateUpAll() error {
	err := p.migrator.Up()
	if err != nil && err != migrate.ErrNoChange {
		return fmt.Errorf("could not migrate the database - %s", err.Error())
	}
	return nil
}

// Version returns the current version of the postgres instance
func (p *postgres) Version() (uint, bool, error) {
	version, dirty, err := p.migrator.Version()
	return version, dirty, err
}

func (p *postgres) Close() error {
	return p.db.Close()
}
