package gcs

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

var now = time.Now()
var testObjects Objects = Objects{
	{
		Name:    "banana",
		Created: now.Add(-time.Hour * 1),
	},
	{
		Name:    "apple",
		Created: now,
	},
	{
		Name:    "apricot",
		Created: now.Add(-time.Hour * 3),
	},
	{
		Name:    "celery",
		Created: now.Add(-time.Hour * 2),
	},
}

func TestSort(t *testing.T) {
	t.Run("Sorts objects by date ascending", func(t *testing.T) {
		objs := make(Objects, len(testObjects))
		copy(objs, testObjects)
		expectedObjects := []*Object{
			{
				Name:    "apple",
				Created: now,
			},
			{
				Name:    "banana",
				Created: now.Add(-time.Hour * 1),
			},
			{
				Name:    "celery",
				Created: now.Add(-time.Hour * 2),
			},
			{
				Name:    "apricot",
				Created: now.Add(-time.Hour * 3),
			},
		}

		objs.Sort(ByDateAscending)
		for i, o := range objs {
			assert.Equal(t, expectedObjects[i].Name, o.Name)
			assert.Equal(t, expectedObjects[i].Created, o.Created)
		}
	})

	t.Run("Sorts objects by date descending", func(t *testing.T) {
		objs := make(Objects, len(testObjects))
		copy(objs, testObjects)
		expectedObjects := []*Object{
			{
				Name:    "apricot",
				Created: now.Add(-time.Hour * 3),
			},
			{
				Name:    "celery",
				Created: now.Add(-time.Hour * 2),
			},
			{
				Name:    "banana",
				Created: now.Add(-time.Hour * 1),
			},
			{
				Name:    "apple",
				Created: now,
			},
		}

		objs.Sort(ByDateDescending)
		for i, o := range objs {
			assert.Equal(t, expectedObjects[i].Name, o.Name)
			assert.Equal(t, expectedObjects[i].Created, o.Created)
		}
	})

	t.Run("Sorts objects by name alphabetically", func(t *testing.T) {
		objs := make(Objects, len(testObjects))
		copy(objs, testObjects)
		expectedObjects := []*Object{
			{
				Name:    "apple",
				Created: now,
			},
			{
				Name:    "apricot",
				Created: now.Add(-time.Hour * 3),
			},
			{
				Name:    "banana",
				Created: now.Add(-time.Hour * 1),
			},
			{
				Name:    "celery",
				Created: now.Add(-time.Hour * 2),
			},
		}

		objs.Sort(ByName)
		for i, o := range objs {
			assert.Equal(t, expectedObjects[i].Name, o.Name)
			assert.Equal(t, expectedObjects[i].Created, o.Created)
		}
	})
}
