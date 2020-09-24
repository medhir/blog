package sql

import (
	"database/sql"
	"errors"
	uuid2 "github.com/google/uuid"
	"strings"
	"time"
)

// BlogPost describes the metadata for a blog post
type BlogPost struct {
	ID          string       `json:"id"`
	Title       string       `json:"title"`
	Slug        string       `json:"slug"`
	Markdown    string       `json:"markdown"`
	CreatedOn   time.Time    `json:"created_on"`
	SavedOn     sql.NullTime `json:"saved_on,omitempty"`
	PublishedOn sql.NullTime `json:"published_on,omitempty"`
	RevisedOn   sql.NullTime `json:"revised_on,omitempty"`
}

// BlogPostAsset describes the metadata for a blog post asset
type BlogPostAsset struct {
	PostID string `json:"post_id"`
	Name   string `json:"name"`
	URL    string `json:"url"`
}

func (p *postgres) CreateDraft(title string, markdown string) (id string, _ error) {
	uuid := uuid2.New().String()
	slug := makeSlug(title)
	query := `
INSERT INTO BlogPost (id, title, slug, markdown, created_on)
VALUES ($1, $2, $3, $4, $5);
`
	_, err := p.db.Exec(query, uuid, title, slug, markdown, time.Now())
	if err != nil {
		return uuid, err
	}
	return "", nil
}

func (p *postgres) GetDraft(id string) (*BlogPost, error) {
	draft := &BlogPost{}
	query := `
SELECT id, title, slug, markdown, created_on, saved_on
FROM blogpost
WHERE id = $1;
`
	err := p.db.QueryRow(query, id).Scan(&draft.ID, &draft.Title, &draft.Slug, &draft.Markdown, &draft.CreatedOn, &draft.SavedOn)
	if err != nil {
		return nil, err
	}
	return draft, nil
}

func (p *postgres) SaveDraft(
	id string,
	title string,
	markdown string,
) error {
	slug := makeSlug(title)
	query := `
UPDATE BlogPost 
SET title = $2, slug = $3, markdown = $4, saved_on = $5
WHERE id = $1;
`
	_, err := p.db.Exec(query, id, title, slug, markdown, time.Now())
	if err != nil {
		return err
	}
	return nil
}

func (p *postgres) DeleteDraftOrPost(id string) error {
	query := `
DELETE FROM BlogPost
WHERE id = $1;
`
	res, err := p.db.Exec(query, id)
	if err != nil {
		return err
	}
	count, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if count == 0 {
		return errors.New("lesson was not deleted, zero rows affected by delete query")
	}
	return nil
}

func (p *postgres) GetDrafts() ([]*BlogPost, error) {
	query := `
SELECT id, title, slug, markdown, created_on, saved_on
FROM BlogPost
WHERE published_on IS NULL
ORDER BY created_on ASC;
`
	rows, err := p.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var drafts []*BlogPost
	for rows.Next() {
		draft := &BlogPost{}
		err := rows.Scan(
			&draft.ID,
			&draft.Title,
			&draft.Slug,
			&draft.Markdown,
			&draft.CreatedOn,
			&draft.SavedOn,
		)
		if err != nil {
			return nil, err
		}
		drafts = append(drafts, draft)
	}
	return drafts, nil
}

func (p *postgres) GetPost(id string) (*BlogPost, error) {
	draft := &BlogPost{}
	query := `
SELECT id, title, slug, markdown, published_on, revised_on
FROM blogpost
WHERE id = $1;
`
	err := p.db.QueryRow(query, id).Scan(&draft.ID, &draft.Title, &draft.Slug, &draft.Markdown, &draft.CreatedOn, &draft.SavedOn)
	if err != nil {
		return nil, err
	}
	return draft, nil
}

func (p *postgres) PublishPost(id string) error {
	query := `
UPDATE BlogPost
SET published_on = $2
WHERE id = $1;
`
	_, err := p.db.Exec(query, id, time.Now())
	if err != nil {
		return err
	}
	return nil
}

func (p *postgres) RevisePost(
	id string,
	title string,
	markdown string,
) error {
	slug := makeSlug(title)
	query := `
UPDATE BlogPost 
SET title = $2, slug = $3, markdown = $4, revised_on = $5
WHERE id = $1;
`
	_, err := p.db.Exec(query, id, title, slug, markdown, time.Now())
	if err != nil {
		return err
	}
	return nil
}

func (p *postgres) GetPosts() ([]*BlogPost, error) {
	query := `
SELECT id, title, slug, markdown, published_on, revised_on
FROM BlogPost
WHERE published_on IS NOT NULL
ORDER BY created_on ASC;
`
	rows, err := p.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []*BlogPost
	for rows.Next() {
		draft := &BlogPost{}
		err := rows.Scan(
			&draft.ID,
			&draft.Title,
			&draft.Slug,
			&draft.Markdown,
			&draft.CreatedOn,
			&draft.SavedOn,
		)
		if err != nil {
			return nil, err
		}
		posts = append(posts, draft)
	}
	return posts, nil
}

func (p *postgres) AddAsset(
	postID string,
	name string,
	url string,
) error {
	query := `
INSERT INTO BlogPostAsset (post_id, name, url)
VALUES ($1, $2, $3);
`
	_, err := p.db.Exec(query, postID, name, url)
	if err != nil {
		return err
	}
	return nil
}

func (p *postgres) DeleteAsset(
	postID string,
	name string,
) error {
	query := `
DELETE FROM BlogPostAsset 
WHERE post_id = $1 AND name = $2;
`
	res, err := p.db.Exec(query, postID, name)
	if err != nil {
		return err
	}
	count, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if count == 0 {
		return errors.New("lesson was not deleted, zero rows affected by delete query")
	}
	return nil
}

func (p *postgres) GetAssets(postID string) ([]*BlogPostAsset, error) {
	query := `
SELECT post_id, name, url
FROM BlogPostAsset 
WHERE post_id = $1;
`
	rows, err := p.db.Query(query, postID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var assets []*BlogPostAsset
	for rows.Next() {
		asset := &BlogPostAsset{}
		err := rows.Scan(
			&asset.PostID,
			&asset.Name,
			&asset.URL,
		)
		if err != nil {
			return nil, err
		}
		assets = append(assets, asset)
	}
	return assets, nil
}

func makeSlug(title string) string {
	lowercase := strings.ToLower(title)
	words := strings.Split(lowercase, " ")
	joined := strings.Join(words, "-")
	return joined
}
