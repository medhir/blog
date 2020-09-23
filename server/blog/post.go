package blog

import "gitlab.com/medhir/blog/server/storage/sql"

func (b *blog) GetPost(id string) (*sql.BlogPost, error) {
	post, err := b.db.GetPost(id)
	if err != nil {
		return nil, err
	}
	return post, nil
}

func (b *blog) PublishPost(id string) error {
	err := b.db.PublishPost(id)
	if err != nil {
		return err
	}
	return nil
}

func (b *blog) RevisePost(id, title, markdown string) error {
	err := b.db.RevisePost(id, title, markdown)
	if err != nil {
		return err
	}
	return nil
}

func (b *blog) DeletePost(id string) error {
	err := b.db.DeleteDraftOrPost(id)
	// delete assets associated with post
	if err != nil {
		return err
	}
	return nil
}

func (b *blog) GetPosts() ([]*sql.BlogPost, error) {
	posts, err := b.db.GetPosts()
	if err != nil {
		return nil, err
	}
	return posts, nil
}
