package blog

import (
	"gitlab.com/medhir/blog/server/storage/gcs"
	"gitlab.com/medhir/blog/server/storage/sql"
	"strings"
	"time"
)

const (
	bucket         = "medhir-com"
	draftFormatter = "blog/drafts/%s.json"
	draftsKey      = "blog/drafts.index.json"
	index          = "blog/index.json"
	postFormatter  = "blog/posts/%s.json"
	postsKey       = "blog/posts.index.json"
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

	AddAsset(postId string, data []byte) error
	DeleteAsset(postId, name string) error
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

// Post describes the data associated with a blog post
type Post struct {
	ID       string `json:"id"`       // uuid identifier
	Title    string `json:"title"`    // title of the post
	Slug     string `json:"slug"`     // a slug for describing the url path for a post
	Markdown string `json:"markdown"` // the post content
	IsDraft  bool   `json:"is_draft"` // bool flag to indicate whether the post is in draft status

	Published int64 `json:"published,omitempty"` // timestamp for when the post was published
	Revised   int64 `json:"revised,omitempty"`   // timestamp for when a published post is revised
	Saved     int64 `json:"saved,omitempty"`     // timestamp for when a draft is saved
}

//// GetDraft retrieves a draft
//func (b *blog) GetDraft(id string) ([]byte, error) {
//	name := fmt.Sprintf(draftFormatter, id)
//	bytes, err := b.gcs.GetObject(name, bucket)
//	if err != nil {
//		return nil, fmt.Errorf("Could not retrieve draft from bucket - %v", err)
//	}
//	return bytes, nil
//}
//
//// AddDraft adds a new draft
//func (b *blog) AddDraft(title, markdown string) error {
//	uuid := uuid.New().String()
//	timestamp := makeTimestamp()
//	slug := makeSlug(title)
//	draft := Post{
//		ID:       uuid,
//		Title:    title,
//		Slug:     slug,
//		Markdown: markdown,
//		IsDraft:  true,
//		Saved:    timestamp,
//	}
//	data, err := json.Marshal(draft)
//	if err != nil {
//		return fmt.Errorf("Unable to encode data to json - %v", err)
//	}
//	name := fmt.Sprintf(draftFormatter, uuid)
//	err = b.gcs.UploadObject(name, bucket, data, false)
//	if err != nil {
//		return fmt.Errorf("Unable to upload draft - %v", err)
//	}
//	return nil
//}
//
//// UpdateDraft updates an existing draft
//func (b *blog) UpdateDraft(id, title, markdown string) error {
//	// Make sure this is a valid draft
//	if id == "" {
//		return errors.New("draft must have an id")
//	}
//	if title == "" {
//		return errors.New("draft must have a title")
//	}
//	name := fmt.Sprintf(draftFormatter, id)
//	_, err := b.gcs.GetObject(name, bucket)
//	if err != nil {
//		return errors.New("id does not match any drafts")
//	}
//
//	// update the draft
//	saved := makeTimestamp()
//	slug := makeSlug(title)
//
//	draft := Post{
//		ID:       id,
//		Title:    title,
//		Slug:     slug,
//		Markdown: markdown,
//		IsDraft:  true,
//		Saved:    saved,
//	}
//	data, err := json.Marshal(draft)
//	if err != nil {
//		return fmt.Errorf("Unable to encode data to json - %v", err)
//	}
//	err = b.gcs.UploadObject(name, bucket, data, false)
//	if err != nil {
//		return fmt.Errorf("Unable to upload draft - %v", err)
//	}
//	return nil
//}
//
//// GetDrafts retrieves all the drafts
//func (b *blog) GetDrafts() ([]byte, error) {
//	bytes, err := b.gcs.GetObject(draftsKey, bucket)
//	if err != nil {
//		return nil, err
//	}
//	return bytes, err
//}
//
//// GetPost retrieves a post
//func (b *blog) GetPost(id string) ([]byte, error) {
//	name := fmt.Sprintf(postFormatter, id)
//	bytes, err := b.gcs.GetObject(name, bucket)
//	if err != nil {
//		return nil, fmt.Errorf("Could not retrieve post - %v", err)
//	}
//	return bytes, nil
//}
//
//// GetPosts retrieves all the posts
//func (b *blog) GetPosts() ([]byte, error) {
//	bytes, err := b.gcs.GetObject(postsKey, bucket)
//	if err != nil {
//		return nil, err
//	}
//	return bytes, err
//}

func makeTimestamp() int64 {
	return time.Now().UnixNano() / int64(time.Millisecond)
}

func makeSlug(title string) string {
	lowercase := strings.ToLower(title)
	words := strings.Split(lowercase, " ")
	joined := strings.Join(words, "-")
	return joined
}
