package blog

import "gitlab.com/medhir/blog/server/storage/sql"

func (b *blog) CreateDraft(title, markdown string) (id string, _ error) {
	id, err := b.db.CreateDraft(title, markdown)
	if err != nil {
		return "", nil
	}
	return id, nil
}

func (b *blog) GetDraft(id string) (*sql.BlogPost, error) {
	draft, err := b.db.GetDraft(id)
	if err != nil {
		return nil, err
	}
	return draft, nil
}

func (b *blog) SaveDraft(id, title, markdown string) error {
	err := b.db.SaveDraft(id, title, markdown)
	if err != nil {
		return err
	}
	return nil
}

func (b *blog) DeleteDraft(id string) error {
	err := b.db.DeleteDraftOrPost(id)
	// delete assets associated with the post
	if err != nil {
		return err
	}
	return nil
}

func (b *blog) GetDrafts() ([]*sql.BlogPost, error) {
	drafts, err := b.db.GetDrafts()
	if err != nil {
		return nil, err
	}
	return drafts, nil
}
