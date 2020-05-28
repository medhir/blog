package sql

import (
	"database/sql"
	"time"
)

type Course struct {
	ID          string       `json:"id"`
	AuthorID    string       `json:"author_id"`
	Title       string       `json:"title"`
	Description string       `json:"description"`
	CreatedAt   time.Time    `json:"created_at"`
	UpdatedAt   sql.NullTime `json:"updated_at"`
}
