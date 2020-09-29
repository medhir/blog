package blog

func (b *blog) GetPost(id string) (*Post, error) {
	postData, err := b.db.GetPost(id)
	if err != nil {
		return nil, err
	}
	post := &Post{
		ID:          postData.ID,
		Title:       postData.Title,
		Slug:        postData.Slug,
		Markdown:    postData.Markdown,
		CreatedOn:   makeTimestamp(postData.CreatedOn),
		PublishedOn: makeTimestamp(postData.PublishedOn.Time),
	}
	if postData.RevisedOn.Valid {
		post.RevisedOn = makeTimestamp(postData.RevisedOn.Time)
	}
	return post, nil
}

func (b *blog) GetPostBySlug(slug string) (*Post, error) {
	postData, err := b.db.GetPostBySlug(slug)
	if err != nil {
		return nil, err
	}
	post := &Post{
		ID:          postData.ID,
		Title:       postData.Title,
		Slug:        postData.Slug,
		Markdown:    postData.Markdown,
		CreatedOn:   makeTimestamp(postData.CreatedOn),
		PublishedOn: makeTimestamp(postData.PublishedOn.Time),
	}
	if postData.RevisedOn.Valid {
		post.RevisedOn = makeTimestamp(postData.RevisedOn.Time)
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

func (b *blog) GetPosts() ([]*Post, error) {
	postsData, err := b.db.GetPosts()
	if err != nil {
		return nil, err
	}
	var posts []*Post
	for _, postData := range postsData {
		post := &Post{
			ID:          postData.ID,
			Title:       postData.Title,
			Slug:        postData.Slug,
			Markdown:    postData.Markdown,
			CreatedOn:   makeTimestamp(postData.CreatedOn),
			PublishedOn: makeTimestamp(postData.PublishedOn.Time),
		}
		if postData.RevisedOn.Valid {
			post.RevisedOn = makeTimestamp(postData.RevisedOn.Time)
		}
		posts = append(posts, post)
	}
	return posts, nil
}
