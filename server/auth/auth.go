package auth

import (
	"errors"

	"github.com/FusionAuth/go-client/pkg/fusionauth"
	"gitlab.medhir.com/medhir/blog/server/util"
)

// Requests & Responses

// LoginRequest describes the credentials needed to perform a login
type LoginRequest struct {
	UserID   string `json:"user_id"`
	Password string `json:"password"`
}

// LoginResponse describes the response from a login request
type LoginResponse struct {
	Token string `json:"token"`
}

// Auth is the interface describing authentication actions
// that can be taken within the application context
type Auth interface {
	Login(request *LoginRequest) (*LoginResponse, error)
	Validate(jwt string) error
}

// FusionAuthClient describes the methods used from the fusionauth client
type FusionAuthClient interface {
	Login(request fusionauth.LoginRequest) (*fusionauth.LoginResponse, *fusionauth.Errors, error)
	ValidateJWT(encodedJWT string) (*fusionauth.ValidateResponse, error)
}

type auth struct {
	appID  string
	client FusionAuthClient
}

// NewAuth instantiates a new authentication controller for the application
// NewAuth takes in a fusionauth client and an application ID (which is also defined in fusionauth)
func NewAuth(fusionAuthClient FusionAuthClient, appID string) Auth {
	return &auth{
		appID:  appID,
		client: fusionAuthClient,
	}
}

// Login attempts to login a user
func (a *auth) Login(request *LoginRequest) (*LoginResponse, error) {
	response, _, err := a.client.Login(fusionauth.LoginRequest{
		LoginId:  request.UserID,
		Password: request.Password,
	})
	if err != nil {
		return nil, err
	}
	if !util.StatusCodeIsSuccessful(response.StatusCode) {
		return nil, errors.New("Login was unsuccessful")
	}

	return &LoginResponse{
		Token: response.Token,
	}, nil
}

// Validate checks if a jwt is still a valid authentication token
func (a *auth) Validate(jwt string) error {
	response, err := a.client.ValidateJWT(jwt)
	if err != nil {
		return err
	}
	if !util.StatusCodeIsSuccessful(response.StatusCode) {
		return errors.New("Validation of JWT unsuccessful")
	}
	return nil
}
