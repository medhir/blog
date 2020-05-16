package auth

import (
	"errors"
	"github.com/Nerzal/gocloak/v5"
	"os"
)

const (
	baseURL = "https://auth.medhir.com"
	realm   = "medhir.com"

	roleUnverifiedUser = "unverified-user"
)

// Auth is the interface describing authentication actions
// that can be taken within the application context
type Auth interface {
	CreateUser(req *CreateUserRequest) (*CreateUserResponse, error)
	UsernameAvailable(username string) (bool, error)
	Login(request *LoginRequest) (*LoginResponse, error)
	Validate(accessToken string) error
	RefreshJWT(refreshToken string) (string, error)
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

// CreateUserRequest describes the request for creating a new user
type CreateUserRequest struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Username  string `json:"username"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

// CreateUserResponse is the response for a call to CreateUser
type CreateUserResponse struct {
	Token string `json:"token"`
}

func (a *auth) CreateUser(req *CreateUserRequest) (*CreateUserResponse, error) {
	token, err := a.client.LoginClient(a.clientID, a.clientSecret, realm)
	if err != nil {
		return nil, err
	}
	// Create new user in the realm
	userID, err := a.client.CreateUser(
		token.AccessToken,
		realm,
		gocloak.User{
			FirstName:  stringPtr(req.FirstName),
			LastName:   stringPtr(req.LastName),
			Username:   stringPtr(req.Username),
			Email:      stringPtr(req.Email),
			RealmRoles: []string{roleUnverifiedUser},
		})
	if err != nil {
		return nil, err
	}
	// set the user's password
	err = a.client.SetPassword(token.AccessToken, userID, realm, req.Password, false)
	if err != nil {
		return nil, err
	}
	// login the user and return the jwt
	jwt, err := a.client.Login(a.clientID, a.clientSecret, realm, req.Username, req.Password)
	if err != nil {
		return nil, err
	}
	return &CreateUserResponse{
		Token: jwt.AccessToken,
	}, nil
}

// UsernameAvailable checks to see if a user for the given username already exists
func (a *auth) UsernameAvailable(username string) (bool, error) {
	token, err := a.client.LoginClient(a.clientID, a.clientSecret, realm)
	if err != nil {
		return false, err
	}
	users, err := a.client.GetUsers(token.AccessToken, realm, gocloak.GetUsersParams{
		Username: stringPtr(username),
	})
	if err != nil {
		return false, err
	}
	if len(users) > 0 {
		return false, nil
	}
	return true, nil
}

// LoginRequest describes the credentials needed to perform a login
type LoginRequest struct {
	UserID   string `json:"user_id"`
	Password string `json:"password"`
}

// LoginResponse describes the response from a login request
type LoginResponse struct {
	Token        string `json:"token"`
	RefreshToken string `json:"refresh_token"`
}

// Login attempts to login a user
func (a *auth) Login(request *LoginRequest) (*LoginResponse, error) {
	token, err := a.client.Login(a.clientID, a.clientSecret, realm, request.UserID, request.Password)
	if err != nil {
		return nil, err
	}

	return &LoginResponse{
		Token:        token.AccessToken,
		RefreshToken: token.RefreshToken,
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

// RefreshJWT uses a refresh token to retrieve a new valid jwt
func (a *auth) RefreshJWT(refreshToken string) (string, error) {
	jwt, err := a.client.RefreshToken(refreshToken, a.clientID, a.clientSecret, realm)
	if err != nil {
		return "", err
	}
	return jwt.AccessToken, nil
}

func stringPtr(str string) *string {
	s := str
	return &s
}
