package sql

import (
	"database/sql"
	"errors"
	"fmt"
	// pq is the database driver for connecting to postgres
	_ "github.com/lib/pq"
	"os"

	"github.com/golang-migrate/migrate/v4"
	// postgres migration driver
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	// migration file reading driver
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

const databaseName = "medhir-com"

type Postgres interface {
	Close() error
}

type postgres struct {
	db *sql.DB
}

// NewPostgres instantiates a new connection to a postgres database, as well as providing an interface for interacting with the db.
// This is meant to be a long living connection, and must be explicitly closed using the postgres.Close() method upon program exit
func NewPostgres() (Postgres, error) {
	host, ok := os.LookupEnv("POSTGRES_HOST")
	if !ok {
		return nil, errors.New("POSTGRES_HOST must be provided")
	}
	port, ok := os.LookupEnv("POSTGRES_PORT")
	if !ok {
		return nil, errors.New("POSTGRES_PORT must be provided")
	}
	user, ok := os.LookupEnv("POSTGRES_USER")
	if !ok {
		return nil, errors.New("POSTGRES_USER must be provided")
	}
	password, ok := os.LookupEnv("POSTGRES_PASSWORD")
	if !ok {
		return nil, errors.New("POSTGRES_PASSWORD must be provided")
	}
	// start connection to database
	db, err := sql.Open(
		"postgres",
		fmt.Sprintf(
			"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
			host,
			port,
			user,
			password,
			databaseName,
		),
	)
	if err != nil {
		return nil, fmt.Errorf("could not start connection to the database - %s", err.Error())
	}
	// ping db to check connection
	err = db.Ping()
	if err != nil {
		return nil, fmt.Errorf("could not connect to the database - %s", err.Error())
	}
	// migrate the database to the latest version
	m, err := migrate.New(
		"file://storage/sql/migrations",
		fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", user, password, host, port, databaseName),
	)
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
