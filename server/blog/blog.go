package blog

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/medhir/blog/server/storage/gcs"
)

const (
	bucket         = "medhir-com"
	draftFormatter = "blog/drafts/%s.json"
	draftsKey      = "blog/drafts.index.json"
	postFormatter  = "blog/posts/%s.json"
	postsKey       = "blog/posts.index.json"
)

// Blog describes the methods available for the blog controller
type Blog interface {
	GetDraft(id string) ([]byte, error)
	PostDraft(markdown, title string) error
	GetDrafts() ([]byte, error)
	// SaveDraft(draft Draft) error
	// PublishPost(draft Draft) error
	// UpdatePost(post Post) error
	GetPost(id string) ([]byte, error)
	GetPosts() ([]byte, error)
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

// GetDraft retrieves a draft
func (b *blog) GetDraft(id string) ([]byte, error) {
	name := fmt.Sprintf(draftFormatter, id)
	bytes, err := b.gcs.GetObject(name, bucket)
	if err != nil {
		return nil, fmt.Errorf("Could not retrieve draft from bucket - %v", err)
	}
	return bytes, nil
}

// PostDraft adds a new draft
func (b *blog) PostDraft(markdown, title string) error {
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
	name := fmt.Sprintf(draftFormatter, uuid)
	err = b.gcs.UploadObject(name, bucket, data)
	if err != nil {
		return fmt.Errorf("Unable to upload draft - %v", err)
	}
	return nil
}

// GetDrafts retrieves all the drafts
func (b *blog) GetDrafts() ([]byte, error) {
	bytes, err := b.gcs.GetObject(draftsKey, bucket)
	if err != nil {
		return nil, err
	}
	return bytes, err
}

// GetPost retrieves a post
func (b *blog) GetPost(id string) ([]byte, error) {
	name := fmt.Sprintf(postFormatter, id)
	bytes, err := b.gcs.GetObject(name, bucket)
	if err != nil {
		return nil, fmt.Errorf("Could not retrieve post - %v", err)
	}
	return bytes, nil
}

// GetPosts retrieves all the posts
func (b *blog) GetPosts() ([]byte, error) {
	bytes, err := b.gcs.GetObject(postsKey, bucket)
	if err != nil {
		return nil, err
	}
	return bytes, err
}

func makeTimestamp() int64 {
	return time.Now().UnixNano() / int64(time.Millisecond)
}
