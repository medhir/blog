package handlers

import (
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"
	"time"
)

const (
	draftFormatter = "blog/drafts/%s.json"
	draftsKey      = "blog/drafts.index.json"
	index          = "blog/index.json"
	postFormatter  = "blog/posts/%s.json"
	postsKey       = "blog/posts.index.json"
)

func (h *handlers) MigrateUp() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := h.db.MigrateUp()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func (h *handlers) MigrateDown() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := h.db.MigrateDown()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func (h *handlers) DatabaseVersion() http.HandlerFunc {
	type databaseVersionResponse struct {
		Version uint `json:"version"`
		Dirty   bool `json:"dirty"`
	}
	return func(w http.ResponseWriter, r *http.Request) {
		version, dirty, err := h.db.Version()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeJSON(w, databaseVersionResponse{
			Version: version,
			Dirty:   dirty,
		})
	}
}

func (h *handlers) MigrateBlog() http.HandlerFunc {
	type blogPost struct {
		ID        string `json:"id"`
		Markdown  string `json:"markdown"`
		Published int64  `json:"published"`
		Title     string `json:"title"`
		TitlePath string `json:"titlePath"`
	}
	type blogDraft struct {
		ID       string `json:"id"`
		Markdown string `json:"markdown"`
		Saved    int64  `json:"saved"`
		Title    string `json:"title"`
	}
	return func(w http.ResponseWriter, r *http.Request) {
		dbPosts, err := h.db.GetPosts()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		dbDrafts, err := h.db.GetDrafts()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if len(dbPosts) > 0 || len(dbDrafts) > 0 {
			http.Error(w, errors.New("there are already entries in the database, aborting migration").Error(), http.StatusUnauthorized)
			return
		}
		// get posts from GCS
		postsMetadata, err := h.gcs.ListObjects(bucket, "blog/posts/")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		var posts []blogPost
		for _, post := range postsMetadata {
			postData, err := h.gcs.GetObject(post.Name, bucket)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			var data blogPost
			json.Unmarshal(postData, &data)
			posts = append(posts, data)
		}
		// get drafts from GCS
		draftsMetadata, err := h.gcs.ListObjects(bucket, "blog/drafts/")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		var drafts []blogDraft
		for _, post := range draftsMetadata {
			draftData, err := h.gcs.GetObject(post.Name, bucket)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			var data blogDraft
			json.Unmarshal(draftData, &data)
			drafts = append(drafts, data)
		}
		// add posts to database
		for _, post := range posts {
			savedDate := sql.NullTime{
				Time:  time.Time{},
				Valid: false,
			}
			publishedDate := sql.NullTime{
				Time:  TimeFromMillis(post.Published),
				Valid: true,
			}
			err := h.db.AddDraftOrPost(post.ID, post.Title, post.Markdown, time.Now(), savedDate, publishedDate)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}
		// add drafts to database
		for _, draft := range drafts {
			savedDate := sql.NullTime{
				Time:  TimeFromMillis(draft.Saved),
				Valid: true,
			}
			publishedDate := sql.NullTime{
				Time:  time.Time{},
				Valid: false,
			}
			err := h.db.AddDraftOrPost(draft.ID, draft.Title, draft.Markdown, time.Now(), savedDate, publishedDate)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}
	}
}

// TimeFromMillis converts a millisecond UNIX timestamp to a Go time object
func TimeFromMillis(millis int64) time.Time {
	return time.Unix(0, millis*int64(time.Millisecond))
}
