package blog

import (
	"gitlab.com/medhir/blog/server/storage/gcs"
	"gitlab.com/medhir/blog/server/storage/sql"
)

const (
	bucket = "medhir-com"
)

// Blog describes the methods available for the blog controller
type Blog interface {
	CreateDraft(title, markdown string) (id string, _ error)
	GetDraft(id string) (*sql.BlogPost, error)
	SaveDraft(id, title, markdown string) error
	DeleteDraft(id string) error
	GetDrafts() ([]*sql.BlogPost, error)

	GetPost(id string) (*sql.BlogPost, error)
	PublishPost(id string) error
	RevisePost(id, title, markdown string) error
	DeletePost(id string) error
	GetPosts() ([]*sql.BlogPost, error)

	AddAsset(postID string, data []byte) error
	DeleteAsset(postID, name string) error
}

type blog struct {
	db  sql.Postgres
	gcs gcs.GCS
}

// NewBlog returns a new blog controller
func NewBlog(db sql.Postgres, gcs gcs.GCS) Blog {
	return &blog{
		db:  db,
		gcs: gcs,
	}
}
