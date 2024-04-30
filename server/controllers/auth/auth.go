package auth

import (
	"context"
	"errors"
	"fmt"
	"github.com/Nerzal/gocloak/v13"
	"github.com/medhir/blog/server/controllers/storage/sql"
)

const (
	realm = "blog"
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
	CreateUser(username, email, password string) error
	AddUserAttribute(user *gocloak.User, key, value string) error
	GetUserAttribute(user *gocloak.User, key string) (string, error)
	RemoveUserAttribute(user *gocloak.User, key string) error
	Login(request *LoginRequest) (*LoginResponse, error)
	ResetUserPassword(usernameOrEmail string) error

	ValidateJWT(jwt string) error
	ValidateRole(jwt string, role Role) error
	RefreshJWT(refreshToken string) (string, error)
}

type KeycloakConfig struct {
	BaseURL       string `json:"base_url"`
	ClientID      string `json:"client_id"`
	ClientSecret  string `json:"client_secret"`
	AdminUsername string `json:"admin_username"`
	AdminPassword string `json:"admin_password"`
}

type auth struct {
	ctx           context.Context
	adminUsername string
	adminPassword string
	client        *gocloak.GoCloak
	clientID      string
	clientSecret  string
	db            sql.Postgres
}

// NewAuth instantiates a new authentication controller for the application
func NewAuth(ctx context.Context, cfg *KeycloakConfig, db sql.Postgres) (Auth, error) {
	auth := &auth{
		ctx:           ctx,
		adminUsername: cfg.AdminUsername,
		adminPassword: cfg.AdminPassword,
		client:        gocloak.NewClient(cfg.BaseURL),
		clientID:      cfg.ClientID,
		clientSecret:  cfg.ClientSecret,
		db:            db,
	}
	return auth, nil
}

func (a *auth) CreateUser(username, email, password string) error {
	token, err := a.client.LoginAdmin(a.ctx, a.adminUsername, a.adminPassword, realm)
	if err != nil {
		return err
	}
	// Create new user in the realm
	userID, err := a.client.CreateUser(
		a.ctx,
		token.AccessToken,
		realm,
		gocloak.User{
			Username: stringPtr(username),
			Email:    stringPtr(email),
			Enabled:  boolPtr(true),
		})
	if err != nil {
		return err
	}
	// set the user's password
	err = a.client.SetPassword(a.ctx, token.AccessToken, userID, realm, password, false)
	if err != nil {
		return err
	}
	// send verification email
	err = a.client.ExecuteActionsEmail(
		a.ctx,
		token.AccessToken,
		realm, gocloak.ExecuteActionsEmail{
			UserID:      stringPtr(userID),
			ClientID:    stringPtr(a.clientID),
			RedirectURI: stringPtr("https://medhir.com/verified"),
			Actions: &[]string{
				"VERIFY_EMAIL",
			},
		},
	)
	if err != nil {
		return err
	}
	// add user to database
	err = a.db.CreateUser(userID, username, email)
	if err != nil {
		return err
	}
	return nil
}

func (a *auth) GetUser(jwt string) (*gocloak.User, error) {
	_, claims, err := a.client.DecodeAccessToken(a.ctx, jwt, realm)
	if err != nil {
		return nil, err
	}
	mapClaims := *claims
	userID, ok := mapClaims["sub"].(string)
	if !ok {
		return nil, errors.New("validation error - could not read jwt subject")
	}
	adminToken, err := a.client.LoginAdmin(a.ctx, a.adminUsername, a.adminPassword, realm)
	if err != nil {
		return nil, err
	}
	user, err := a.client.GetUserByID(a.ctx, adminToken.AccessToken, realm, userID)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (a *auth) AddUserAttribute(user *gocloak.User, key string, value string) error {
	//adminToken, err := a.client.LoginAdmin(a.ctx, a.adminUsername, a.adminPassword, realm)
	//if err != nil {
	//	return err
	//}
	//if user.Attributes != nil {
	//	user.Attributes[key] = []string{value}
	//} else {
	//	user.Attributes = map[string][]string{
	//		key: {value},
	//	}
	//}
	//err = a.client.UpdateUser(a.ctx, adminToken.AccessToken, realm, *user)
	//if err != nil {
	//	return err
	//}
	return nil
}

func (a *auth) GetUserAttribute(user *gocloak.User, key string) (string, error) {
	//attribute := user.Attributes[key]
	attribute := []string{}
	if len(attribute) == 0 {
		return "", fmt.Errorf("no user attribute found for key %s", key)
	}
	return attribute[0], nil
}

func (a *auth) RemoveUserAttribute(user *gocloak.User, key string) error {
	adminToken, err := a.client.LoginAdmin(a.ctx, a.adminUsername, a.adminPassword, realm)
	//if err != nil {
	//	return err
	//}
	//if user.Attributes != nil {
	//	user.Attributes[key] = []string{}
	//}
	err = a.client.UpdateUser(a.ctx, adminToken.AccessToken, realm, *user)
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

// Login attempts to log in a user
func (a *auth) Login(request *LoginRequest) (*LoginResponse, error) {
	token, err := a.client.Login(a.ctx, a.clientID, a.clientSecret, realm, request.UserID, request.Password)
	if err != nil {
		return nil, err
	}
	return &LoginResponse{
		Token:        token.AccessToken,
		RefreshToken: token.RefreshToken,
	}, nil
}

// RefreshJWT uses a refresh token to retrieve a new valid jwt
func (a *auth) RefreshJWT(refreshToken string) (string, error) {
	jwt, err := a.client.RefreshToken(a.ctx, refreshToken, a.clientID, a.clientSecret, realm)
	if err != nil {
		return "", err
	}
	return jwt.AccessToken, nil
}

func (a *auth) ResetUserPassword(usernameOrEmail string) error {
	token, err := a.client.LoginAdmin(a.ctx, a.adminUsername, a.adminPassword, realm)
	if err != nil {
		return err
	}
	user, err := a.db.GetUserByUsernameOrEmail(usernameOrEmail)
	if err != nil {
		return err
	}
	// send password reset email
	err = a.client.ExecuteActionsEmail(
		a.ctx,
		token.AccessToken,
		realm, gocloak.ExecuteActionsEmail{
			UserID:      stringPtr(user.ID),
			ClientID:    stringPtr(a.clientID),
			RedirectURI: stringPtr("https://medhir.com/blog/edit"),
			Actions: &[]string{
				"UPDATE_PASSWORD",
			},
		},
	)
	return nil
}

func (a *auth) RealmRepresentation() (*gocloak.RealmRepresentation, error) {
	adminToken, err := a.client.LoginAdmin(a.ctx, a.adminUsername, a.adminPassword, realm)
	if err != nil {
		return nil, err
	}
	representation, err := a.client.GetRealm(a.ctx, adminToken.AccessToken, realm)
	if err != nil {
		return nil, err
	}
	return representation, nil
}

// ValidateJWT determines if a jwt is still a valid authentication token
func (a *auth) ValidateJWT(jwt string) error {
	rptResult, err := a.client.RetrospectToken(a.ctx, jwt, a.clientID, a.clientSecret, realm)
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
	_, claims, err := a.client.DecodeAccessToken(a.ctx, jwt, realm)
	if err != nil {
		return err
	}
	mapClaims := *claims
	realmAccess, ok := mapClaims["realm_access"].(map[string]interface{})
	if !ok {
		return errors.New("validation error - could not read realm_access")
	}
	roles, ok := realmAccess["roles"].([]interface{})
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

func stringPtr(str string) *string {
	s := str
	return &s
}

func boolPtr(bool bool) *bool {
	b := bool
	return &b
}
