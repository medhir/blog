package sql

import (
	"fmt"
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
	err = pg.MigrateUpAll()
	if err != nil {
		log.Fatalf("Could not migrate database, %s", err)
	}
	code := m.Run()

	os.Exit(code)
}
