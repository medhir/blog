package sql

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func Test_makeSlug(t *testing.T) {
	slug1 := makeSlug("a title")
	slug2 := makeSlug("A title")
	slug3 := makeSlug("A Much Longer Title")

	assert.Equal(t, "a-title", slug1)
	assert.Equal(t, "a-title", slug2)
	assert.Equal(t, "a-much-longer-title", slug3)
}

func TestDraft(t *testing.T) {
	title := "An amazing blog draft"
	mdx := "# An amazing blog draft"

	// Add draft & check contents
	id, err := pg.CreateDraft(title, mdx)
	assert.NoError(t, err)
	draft, err := pg.GetDraft(id)
	assert.NoError(t, err)
	assert.Equal(t, id, draft.ID)
	assert.Equal(t, title, draft.Title)
	assert.Equal(t, mdx, draft.Markdown)
	assert.Equal(t, "an-amazing-blog-draft", draft.Slug)
	assert.NotEmpty(t, draft.CreatedOn)
	assert.False(t, draft.SavedOn.Valid)
	assert.False(t, draft.PublishedOn.Valid)
	assert.False(t, draft.RevisedOn.Valid)

	// Update draft & check contents
	title = "An amazing updated blog draft"
	mdx = "# An amazing updated blog draft"
	err = pg.SaveDraft(id, title, mdx)
	assert.NoError(t, err)
	draft, err = pg.GetDraft(id)
	assert.NoError(t, err)
	assert.Equal(t, id, draft.ID)
	assert.Equal(t, title, draft.Title)
	assert.Equal(t, mdx, draft.Markdown)
	assert.Equal(t, "an-amazing-updated-blog-draft", draft.Slug)
	assert.NotEmpty(t, draft.CreatedOn)
	assert.True(t, draft.SavedOn.Valid)
	assert.False(t, draft.PublishedOn.Valid)
	assert.False(t, draft.RevisedOn.Valid)

	// Delete draft & confirm it no longer exists
	err = pg.DeleteDraftOrPost(id)
	assert.NoError(t, err)
	_, err = pg.GetDraft(id)
	assert.Error(t, err)
}

func TestPost(t *testing.T) {
	title := "An amazing blog post"
	mdx := "# An amazing blog post"

	// Add draft
	id, err := pg.CreateDraft(title, mdx)
	assert.NoError(t, err)

	// Publish draft & check contents
	err = pg.PublishPost(id)
	assert.NoError(t, err)
	post, err := pg.GetPost(id)
	assert.NoError(t, err)
	assert.Equal(t, id, post.ID)
	assert.Equal(t, title, post.Title)
	assert.Equal(t, mdx, post.Markdown)
	assert.Equal(t, "an-amazing-blog-post", post.Slug)
	assert.Empty(t, post.CreatedOn)
	assert.Empty(t, post.SavedOn)
	assert.True(t, post.PublishedOn.Valid)
	assert.False(t, post.RevisedOn.Valid)

	// Update post & check contents
	title = "An amazing updated blog post"
	mdx = "# An amazing updated blog post"
	err = pg.RevisePost(id, title, mdx)
	assert.NoError(t, err)
	post, err = pg.GetPost(id)
	assert.Equal(t, id, post.ID)
	assert.Equal(t, title, post.Title)
	assert.Equal(t, mdx, post.Markdown)
	assert.Equal(t, "an-amazing-updated-blog-post", post.Slug)
	assert.Empty(t, post.CreatedOn)
	assert.Empty(t, post.SavedOn)
	assert.True(t, post.PublishedOn.Valid)
	assert.True(t, post.RevisedOn.Valid)

	// Delete post & confirm it no longer exists
	err = pg.DeleteDraftOrPost(id)
	assert.NoError(t, err)
	_, err = pg.GetPost(id)
	assert.Error(t, err)
}

func TestAsset(t *testing.T) {
	title := "An amazing blog post"
	mdx := "# An amazing blog post"

	// Add draft
	id, err := pg.CreateDraft(title, mdx)
	assert.NoError(t, err)

	assetName := "an/asset/name"
	assetURL := "https://asset.org/asset/name"

	// Add asset
	err = pg.AddAsset(id, assetName, assetURL)
	assert.NoError(t, err)

	// Get assets
	assets, err := pg.GetAssets(id)
	assert.NoError(t, err)
	assert.Equal(t, 1, len(assets))
	assert.Equal(t, assetName, assets[0].Name)
	assert.Equal(t, assetURL, assets[0].URL)

	// entry should not delete if assets are attached
	err = pg.DeleteDraftOrPost(id)
	assert.Error(t, err)

	// Delete asset
	err = pg.DeleteAsset(id, assetName)
	assert.NoError(t, err)
	assets, err = pg.GetAssets(id)
	assert.NoError(t, err)
	assert.Equal(t, 0, len(assets))

	// entry should be able to be deleted if no assets exist
	err = pg.DeleteDraftOrPost(id)
	assert.NoError(t, err)
}
