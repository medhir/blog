package auth

import (
	"errors"
	"net/http"
	"testing"

	"github.com/FusionAuth/go-client/pkg/fusionauth"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestLogin(t *testing.T) {
	t.Run("Should login the user if provided proper credentials", func(t *testing.T) {
		mockFusionAuthClient := &MockFusionAuthClient{}
		defer mockFusionAuthClient.AssertExpectations(t)

		mockFusionAuthClient.
			On("Login", mock.Anything).
			Return(&fusionauth.LoginResponse{
				BaseHTTPResponse: fusionauth.BaseHTTPResponse{
					StatusCode: http.StatusOK,
				},
				Token: "abcd1234",
			}, nil, nil)

		loginRequest := &LoginRequest{
			UserID:   "user",
			Password: "password",
		}

		auth := NewAuth(mockFusionAuthClient, "1")

		response, err := auth.Login(loginRequest)
		assert.Nil(t, err)
		assert.Equal(t, "abcd1234", response.Token)
	})

	t.Run("Should return an error if the provided credentials are invalid", func(t *testing.T) {
		mockFusionAuthClient := &MockFusionAuthClient{}
		defer mockFusionAuthClient.AssertExpectations(t)

		mockFusionAuthClient.
			On("Login", mock.Anything).
			Return(nil, nil, errors.New("Wrong credentials"))

		loginRequest := &LoginRequest{
			UserID:   "user",
			Password: "wrong_password",
		}

		auth := NewAuth(mockFusionAuthClient, "1")

		response, err := auth.Login(loginRequest)
		assert.Error(t, err)
		assert.Nil(t, response)
	})

	t.Run("Should return an error if the server errors", func(t *testing.T) {
		mockFusionAuthClient := &MockFusionAuthClient{}
		defer mockFusionAuthClient.AssertExpectations(t)

		mockFusionAuthClient.
			On("Login", mock.Anything).
			Return(&fusionauth.LoginResponse{
				BaseHTTPResponse: fusionauth.BaseHTTPResponse{
					StatusCode: http.StatusInternalServerError,
				},
			}, nil, nil)

		loginRequest := &LoginRequest{
			UserID:   "user",
			Password: "password",
		}

		auth := NewAuth(mockFusionAuthClient, "1")

		response, err := auth.Login(loginRequest)
		assert.Error(t, err)
		assert.Nil(t, response)
	})
}

func TestValidate(t *testing.T) {
	t.Run("Should return true if provided a valid jwt.", func(t *testing.T) {
		mockFusionAuthClient := &MockFusionAuthClient{}
		defer mockFusionAuthClient.AssertExpectations(t)

		mockFusionAuthClient.
			On("ValidateJWT", mock.Anything).
			Return(&fusionauth.ValidateResponse{
				BaseHTTPResponse: fusionauth.BaseHTTPResponse{
					StatusCode: http.StatusOK,
				},
			}, nil)

		auth := NewAuth(mockFusionAuthClient, "1")

		err := auth.Validate("abcd1234")
		assert.Nil(t, err)
	})

	t.Run("Should return false if provided an invalid jwt", func(t *testing.T) {
		mockFusionAuthClient := &MockFusionAuthClient{}
		defer mockFusionAuthClient.AssertExpectations(t)

		mockFusionAuthClient.
			On("ValidateJWT", mock.Anything).
			Return(nil, errors.New("Invalid JWT"))

		auth := NewAuth(mockFusionAuthClient, "1")

		err := auth.Validate("abcd1234")
		assert.Error(t, err)
	})
}
