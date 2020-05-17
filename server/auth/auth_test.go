package auth

import (
	"errors"
	"github.com/Nerzal/gocloak/v5"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"testing"
)

func TestLogin(t *testing.T) {
	t.Run("Should login the user if provided proper credentials", func(t *testing.T) {
		mockGoCloak := &MockGoCloak{}
		defer mockGoCloak.AssertExpectations(t)

		mockGoCloak.
			On(
				"Login",
				mock.Anything, // clientID
				mock.Anything, // clientSecret
				realm,         // realm
				mock.Anything, // userID
				mock.Anything, // password
			).
			Return(&gocloak.JWT{
				AccessToken: "abcd1234",
			}, nil)

		loginRequest := &LoginRequest{
			UserID:   "user",
			Password: "password",
		}

		auth := &auth{
			client:       mockGoCloak,
			clientID:     "1",
			clientSecret: "*whisper*",
		}

		response, err := auth.Login(loginRequest)
		assert.Nil(t, err)
		assert.Equal(t, "abcd1234", response.Token)
	})

	t.Run("Should return an error if the provided credentials are invalid", func(t *testing.T) {
		mockGoCloak := &MockGoCloak{}
		defer mockGoCloak.AssertExpectations(t)

		mockGoCloak.
			On(
				"Login",
				mock.Anything, // clientID
				mock.Anything, // clientSecret
				realm,         // realm
				mock.Anything, // userID
				mock.Anything, // password
			).
			Return(nil, errors.New("wrong credentials"))

		loginRequest := &LoginRequest{
			UserID:   "user",
			Password: "password",
		}

		auth := &auth{
			client:       mockGoCloak,
			clientID:     "1",
			clientSecret: "*whisper*",
		}

		response, err := auth.Login(loginRequest)
		assert.Error(t, err)
		assert.Nil(t, response)
	})
}

func TestValidate(t *testing.T) {
	t.Run("Should return true if provided a valid jwt.", func(t *testing.T) {
		mockGoCloak := &MockGoCloak{}
		defer mockGoCloak.AssertExpectations(t)

		mockGoCloak.
			On(
				"RetrospectToken",
				mock.Anything, // jwt
				mock.Anything, // clientID
				mock.Anything, // clientSecret
				realm,         // realm
			).
			Return(&gocloak.RetrospecTokenResult{
				Active: boolPtr(true),
			}, nil)

		auth := &auth{
			client:       mockGoCloak,
			clientID:     "1",
			clientSecret: "*whisper*",
		}

		err := auth.Validate("aValidToken")
		assert.NoError(t, err)
	})

	t.Run("Should return an error if provided an invalid jwt", func(t *testing.T) {
		mockGoCloak := &MockGoCloak{}
		defer mockGoCloak.AssertExpectations(t)

		mockGoCloak.
			On(
				"RetrospectToken",
				mock.Anything, // jwt
				mock.Anything, // clientID
				mock.Anything, // clientSecret
				realm,         // realm
			).
			Return(&gocloak.RetrospecTokenResult{
				Active: boolPtr(false),
			}, nil)

		auth := &auth{
			client:       mockGoCloak,
			clientID:     "1",
			clientSecret: "*whisper*",
		}

		err := auth.Validate("anInvalidToken")
		assert.Error(t, err)
	})
}
