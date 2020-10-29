package sql

import (
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestUser(t *testing.T) {
	id := uuid.New().String()
	err := pg.CreateUser(id, "bob", "bob@gmail.com")
	assert.NoError(t, err)
	// should not be able to add a user with the same username or email as an existing user
	id2 := uuid.New().String()
	err = pg.CreateUser(id2, "bob", "bob@gmail.com")
	assert.Error(t, err)
	// should be able to delete user
	err = pg.DeleteUser(id)
	assert.NoError(t, err)
}

func TestPostgres_GetUserByUsernameOrEmail(t *testing.T) {
	id := uuid.New().String()
	err := pg.CreateUser(id, "bob", "bob@gmail.com")
	assert.NoError(t, err)
	user, err := pg.GetUserByUsernameOrEmail("bob")
	assert.Equal(t, id, user.ID)
	assert.NoError(t, err)
	user, err = pg.GetUserByUsernameOrEmail("bob@gmail.com")
	assert.Equal(t, id, user.ID)
	assert.NoError(t, err)
	user, err = pg.GetUserByUsernameOrEmail("notexist")
	assert.Error(t, err)
	err = pg.DeleteUser(id)
	assert.NoError(t, err)
}
