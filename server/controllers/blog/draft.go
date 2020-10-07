package blog

func (b *blog) CreateDraft(title, markdown string) (id string, _ error) {
	id, err := b.db.CreateDraft(title, markdown)
	if err != nil {
		return "", nil
	}
	return id, nil
}

func (b *blog) GetDraft(id string) (*Post, error) {
	draftData, err := b.db.GetDraft(id)
	if err != nil {
		return nil, err
	}
	draft := &Post{
		ID:        draftData.ID,
		Title:     draftData.Title,
		Slug:      draftData.Slug,
		Markdown:  draftData.Markdown,
		CreatedOn: makeTimestamp(draftData.CreatedOn),
		SavedOn:   makeTimestamp(draftData.SavedOn.Time),
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

func (b *blog) GetDrafts() ([]*Post, error) {
	draftsData, err := b.db.GetDrafts()
	if err != nil {
		return nil, err
	}
	var drafts []*Post
	for _, draftData := range draftsData {
		draft := &Post{
			ID:        draftData.ID,
			Title:     draftData.Title,
			Slug:      draftData.Slug,
			Markdown:  draftData.Markdown,
			CreatedOn: makeTimestamp(draftData.CreatedOn),
			SavedOn:   makeTimestamp(draftData.SavedOn.Time),
		}
		drafts = append(drafts, draft)
	}
	return drafts, nil
}
