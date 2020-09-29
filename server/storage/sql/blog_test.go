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
