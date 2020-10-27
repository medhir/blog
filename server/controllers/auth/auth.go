package auth

import (
	"errors"
	"fmt"
	"github.com/Nerzal/gocloak/v5"
	"os"
)

const (
	baseURL = "https://auth.medhir.com"
	realm   = "medhir.com"
)

// Role represents a user role required to authenticate users selectively to application resources
type Role string

const (
	// BlogOwner represents the blog owner role
	BlogOwner = Role("blog-owner")
)

// Auth is the interface describing authentication actions
// that can be taken within the application context
type Auth interface {
	GetUser(jwt string) (*gocloak.User, error)
	CreateUser(req *CreateUserRequest) (*CreateUserResponse, error)
	AddUserAttribute(user *gocloak.User, key, value string) error
	GetUserAttribute(user *gocloak.User, key string) (string, error)
	RemoveUserAttribute(user *gocloak.User, key string) error
	Login(request *LoginRequest) (*LoginResponse, error)

	ValidateJWT(jwt string) error
	ValidateRole(jwt string, role Role) error
	RefreshJWT(refreshToken string) (string, error)
}

type auth struct {
	client        gocloak.GoCloak
	clientID      string
	clientSecret  string
	adminUsername string
	adminPassword string
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
	adminUsername, ok := os.LookupEnv("KEYCLOAK_ADMIN_USERNAME")
	if !ok {
		return nil, errors.New("KEYCLOAK_ADMIN_USERNAME environment variable must be provided")
	}
	adminPassword, ok := os.LookupEnv("KEYCLOAK_ADMIN_PASSWORD")
	if !ok {
		return nil, errors.New("KEYCLOAK_ADMIN_PASSWORD environment variable must be provided")
	}

	auth := &auth{
		client:        gocloak.NewClient(baseURL),
		clientID:      clientID,
		clientSecret:  clientSecret,
		adminUsername: adminUsername,
		adminPassword: adminPassword,
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
	Token        string `json:"token"`
	RefreshToken string `json:"refresh_token"`
}

func (a *auth) CreateUser(req *CreateUserRequest) (*CreateUserResponse, error) {
	token, err := a.client.LoginAdmin(a.adminUsername, a.adminPassword, realm)
	if err != nil {
		return nil, err
	}
	// Create new user in the realm
	userID, err := a.client.CreateUser(
		token.AccessToken,
		realm,
		gocloak.User{
			FirstName: stringPtr(req.FirstName),
			LastName:  stringPtr(req.LastName),
			Username:  stringPtr(req.Username),
			Email:     stringPtr(req.Email),
			Enabled:   boolPtr(true),
		})
	if err != nil {
		return nil, err
	}
	// set the user's password
	err = a.client.SetPassword(token.AccessToken, userID, realm, req.Password, false)
	if err != nil {
		return nil, err
	}
	token, err = a.client.Login(a.clientID, a.clientSecret, realm, req.Username, req.Password)
	if err != nil {
		return nil, err
	}

	return &CreateUserResponse{
		Token:        token.AccessToken,
		RefreshToken: token.RefreshToken,
	}, nil
}

func (a *auth) GetUser(jwt string) (*gocloak.User, error) {
	_, claims, err := a.client.DecodeAccessToken(jwt, realm)
	if err != nil {
		return nil, err
	}
	mapClaims := *claims
	userID, ok := mapClaims["sub"].(string)
	if !ok {
		return nil, errors.New("validation error - could not read jwt subject")
	}
	adminToken, err := a.client.LoginAdmin(a.adminUsername, a.adminPassword, realm)
	if err != nil {
		return nil, err
	}
	user, err := a.client.GetUserByID(adminToken.AccessToken, realm, userID)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (a *auth) AddUserAttribute(user *gocloak.User, key string, value string) error {
	adminToken, err := a.client.LoginAdmin(a.adminUsername, a.adminPassword, realm)
	if err != nil {
		return err
	}
	if user.Attributes != nil {
		user.Attributes[key] = []string{value}
	} else {
		user.Attributes = map[string][]string{
			key: {value},
		}
	}
	err = a.client.UpdateUser(adminToken.AccessToken, realm, *user)
	if err != nil {
		return err
	}
	return nil
}

func (a *auth) GetUserAttribute(user *gocloak.User, key string) (string, error) {
	attribute := user.Attributes[key]
	if len(attribute) == 0 {
		return "", fmt.Errorf("no user attribute found for key %s", key)
	}
	return attribute[0], nil
}

func (a *auth) RemoveUserAttribute(user *gocloak.User, key string) error {
	adminToken, err := a.client.LoginAdmin(a.adminUsername, a.adminPassword, realm)
	if err != nil {
		return err
	}
	if user.Attributes != nil {
		user.Attributes[key] = []string{}
	}
	err = a.client.UpdateUser(adminToken.AccessToken, realm, *user)
	if err != nil {
		return err
	}
	return nil
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

// ValidateJWT determines if a jwt is still a valid authentication token
func (a *auth) ValidateJWT(jwt string) error {
	rptResult, err := a.client.RetrospectToken(jwt, a.clientID, a.clientSecret, realm)
	if err != nil {
		return err
	}
	if *rptResult.Active != true {
		return errors.New("jwt is no longer valid")
	}
	return nil
}

// ValidateRole checks if a jwt has the proper claims for the specified role
func (a *auth) ValidateRole(jwt string, role Role) error {
	_, claims, err := a.client.DecodeAccessToken(jwt, realm)
	if err != nil {
		return err
	}
	mapClaims := *claims
	resourceAccess, ok := mapClaims["resource_access"].(map[string]interface{})
	if !ok {
		return errors.New("validation error - could not read resource_access")
	}
	goServer, ok := resourceAccess["go-server"].(map[string]interface{})
	if !ok {
		return errors.New("validation error - could not read go-server")
	}
	roles, ok := goServer["roles"].([]interface{})
	if !ok {
		return errors.New("validation error - could not read roles")
	}
	validated := false
	for _, claimRole := range roles {
		r, ok := claimRole.(string)
		if !ok {
			return errors.New("could not convert role to string")
		}
		if r == string(role) {
			validated = true
			break
		}
	}
	if !validated {
		return errors.New("user is not authorized to access this resource")
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

func boolPtr(bool bool) *bool {
	b := bool
	return &b
}
