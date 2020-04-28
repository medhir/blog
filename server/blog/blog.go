package blog

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/medhir/blog/server/storage/gcs"
)

const bucket = "medhir-com"

// Blog describes the methods available for the blog controller
type Blog interface {
	AddDraft(markdown, title string) error
	// SaveDraft(draft Draft) error
	// PublishPost(draft Draft) error
	// UpdatePost(post Post) error
}

type blog struct {
	gcs gcs.GCS
}

// NewBlog returns a new blog controller
func NewBlog(gcs gcs.GCS) Blog {
	return &blog{
		gcs: gcs,
	}
}

// Post describes the data associated with a blog post
type Post struct {
	Title     string `json:"title"`
	TitlePath string `json:"titlePath"`
	Markdown  string `json:"markdown"`
	Published int64  `json:"published"`
	ID        string `json:"id"`
}

// Draft describes the data associated with a blog post draft
type Draft struct {
	ID       string `json:"id"`
	Markdown string `json:"markdown"`
	Saved    int64  `json:"saved"`
	Title    string `json:"title"`
}

// AddDraft adds a draft
func (b *blog) AddDraft(markdown, title string) error {
	uuid := uuid.New().String()
	draft := Draft{
		ID:       uuid,
		Markdown: markdown,
		Saved:    makeTimestamp(),
		Title:    title,
	}
	data, err := json.Marshal(draft)
	if err != nil {
		return fmt.Errorf("Unable to encode data to json - %v", err)
	}
	name := fmt.Sprintf("blog/drafts/%s.json", uuid)
	err = b.gcs.UploadObject(name, bucket, data)
	if err != nil {
		return fmt.Errorf("Unable to upload draft - %v", err)
	}
	return nil
}

func makeTimestamp() int64 {
	return time.Now().UnixNano() / int64(time.Millisecond)
}
