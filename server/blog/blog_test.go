package blog

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestAddDraft(t *testing.T) {
	t.Run("Successfully uploads a blog post", func(t *testing.T) {})
	t.Run("Returns an error if upload to gcs fails", func(t *testing.T) {})
}

func Test_makeSlug(t *testing.T) {
	slug1 := makeSlug("a title")
	slug2 := makeSlug("A title")
	slug3 := makeSlug("A Much Longer Title")

	assert.Equal(t, "a-title", slug1)
	assert.Equal(t, "a-title", slug2)
	assert.Equal(t, "a-much-longer-title", slug3)
}
