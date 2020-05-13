package auth

import (
	"errors"
	"github.com/Nerzal/gocloak/v5"
	"os"
)

const (
	baseURL = "https://auth.medhir.com"
	realm   = "medhir.com"
)

/////////////////////////////////////////////////////////////////////////////////////////////////////
// Requests & Responses
/////////////////////////////////////////////////////////////////////////////////////////////////////

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
	Validate(accessToken string) error
}

type auth struct {
	client       gocloak.GoCloak
	clientID     string
	clientSecret string
}

// NewAuth instantiates a new authentication controller for the application
func NewAuth() (Auth, error) {
	clientID, ok := os.LookupEnv("KEYCLOAK_CLIENT_ID")
	if !ok {
		return nil, errors.New("KEYCLOAK_CLIENT_ID environment variable must be provided")
	}
	clientSecret, ok := os.LookupEnv("KEYCLOAK_CLIENT_SECRET")
	if !ok {
		return nil, errors.New("KEYCLOAK_CLIENT_SECRET environment variable must be provided")
	}
	auth := &auth{
		client:       gocloak.NewClient(baseURL),
		clientID:     clientID,
		clientSecret: clientSecret,
	}
	return auth, nil
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// Interface implementation
/////////////////////////////////////////////////////////////////////////////////////////////////////

// Login attempts to login a user
func (a *auth) Login(request *LoginRequest) (*LoginResponse, error) {
	token, err := a.client.Login(a.clientID, a.clientSecret, realm, request.UserID, request.Password)
	if err != nil {
		return nil, err
	}

	return &LoginResponse{
		Token: token.AccessToken,
	}, nil
}

// Validate checks if a jwt is still a valid authentication token
func (a *auth) Validate(jwt string) error {
	rptResult, err := a.client.RetrospectToken(jwt, a.clientID, a.clientSecret, realm)
	if err != nil {
		return err
	}
	if !*rptResult.Active {
		return errors.New("access token is invalid")
	}
	return nil
}
