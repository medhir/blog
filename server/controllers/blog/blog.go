package blog

import (
	"time"

	"github.com/medhir/blog/server/controllers/storage/gcs"
	"github.com/medhir/blog/server/controllers/storage/sql"
)

const (
	bucket = "medhir-com"
)

// Post describes the metadata for a blog post sent to the client
type Post struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Slug        string `json:"slug"`
	Markdown    string `json:"markdown"`
	CreatedOn   int64  `json:"created_on"`
	SavedOn     int64  `json:"saved_on,omitempty"`
	PublishedOn int64  `json:"published_on,omitempty"`
	RevisedOn   int64  `json:"revised_on,omitempty"`
}

// Blog describes the methods available for the blog controller
type Blog interface {
	CreateDraft(title, markdown string) (id string, _ error)
	GetDraft(id string) (*Post, error)
	SaveDraft(id, title, markdown string) error
	DeleteDraft(id string) error
	GetDrafts() ([]*Post, error)

	GetPost(id string) (*Post, error)
	GetPostBySlug(slug string) (*Post, error)
	PublishPost(id string) error
	RevisePost(id, title, markdown string) error
	DeletePost(id string) error
	GetPosts() ([]*Post, error)

	AddAsset(postID string, data []byte) (url string, _ error)
	DeleteAsset(postID, name string) error
	DeleteAssets(postID string) error
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

func makeTimestamp(date time.Time) int64 {
	return date.UnixNano() / int64(time.Millisecond)
}
