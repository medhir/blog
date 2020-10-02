package handlers

import (
	"encoding/json"
	"fmt"
	"github.com/Nerzal/gocloak/v5"
	"gitlab.com/medhir/blog/server/controllers/auth"
	"net/http"
	"path"
	"time"
)

const (
	local             = "local"
	medhircom         = "medhir.com"
	jwtCookieName     = "tr4x2ki0ptz"
	refreshCookieName = "y4h3j18f92knu2"
)

// Credentials describes the JSON request for a user login
type Credentials struct {
	LoginID  string `json:"loginID"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

// Login handles the logging in of a user
func (h *handlers) Login() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()
		// read credentials from request
		var credentials Credentials
		err := json.NewDecoder(r.Body).Decode(&credentials)
		if err != nil {
			http.Error(w, "Unable to decode data in request body", http.StatusInternalServerError)
			return
		}
		if credentials.Role == "" {
			http.Error(w, "role must be provided", http.StatusBadRequest)
			return
		}
		// attempt to log in the user
		authResponse, err := h.auth.Login(&auth.LoginRequest{
			UserID:   credentials.LoginID,
			Password: credentials.Password,
		})
		if err != nil {
			http.Error(w, fmt.Sprintf("Error trying to login the user - %v", err), http.StatusInternalServerError)
			return
		}
		err = h.auth.ValidateRole(authResponse.Token, auth.Role(credentials.Role))
		if err != nil {
			http.Error(w, "you do not have access to this resource", http.StatusUnauthorized)
			return
		}
		// set authentication tokens as http-only cookies
		h.setAuthCookies(w, authResponse.Token, authResponse.RefreshToken)
	}
}

// Authorize is a middleware that checks the validity of a jwt before proceeding with a request
func (h *handlers) Authorize(role auth.Role, handler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		jwtCookie, err := r.Cookie(jwtCookieName)
		if err != nil {
			http.Error(w, fmt.Sprintf("Could not find authorization cookie - %v", err), http.StatusInternalServerError)
			return
		}
		err = h.auth.ValidateJWT(jwtCookie.Value)
		if err != nil {
			http.Error(w, err.Error(), http.StatusUnauthorized)
		}
		// make sure this user has the role claims necessary to access the resource
		err = h.auth.ValidateRole(jwtCookie.Value, role)
		if err != nil {
			http.Error(w, err.Error(), http.StatusUnauthorized)
		}
		// and then proceed with the rest of the authorized code
		handler(w, r)
	}
}

// ValidateJWT indicates whether or not an application has a valid authentication token
func (h *handlers) ValidateJWT() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		role := path.Base(r.URL.Path)
		jwtCookie, err := r.Cookie(jwtCookieName)
		if err != nil {
			http.Error(w, fmt.Sprintf("Could not find authorization cookie - %v", err), http.StatusInternalServerError)
			return
		}
		err = h.auth.ValidateJWT(jwtCookie.Value)
		if err != nil {
			http.Error(w, err.Error(), http.StatusUnauthorized)
		}
		err = h.auth.ValidateRole(jwtCookie.Value, auth.Role(role))
		if err != nil {
			http.Error(w, err.Error(), http.StatusUnauthorized)
		}
	}
}

// RefreshJWT refreshes the jwt access token using the refresh cookie value to set a new access token value
func (h *handlers) RefreshJWT() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		refreshCookie, err := r.Cookie(refreshCookieName)
		if err != nil {
			http.Error(w, fmt.Sprintf("Could not find refresh cookie - %v", err), http.StatusInternalServerError)
			return
		}
		newAccessToken, err := h.auth.RefreshJWT(refreshCookie.Value)
		if err != nil {
			http.Error(w, err.Error(), http.StatusUnauthorized)
			return
		}
		h.setAuthCookies(w, newAccessToken, "")
	}
}

func (h *handlers) RefreshForNext() http.HandlerFunc {
	type refreshForNextResponse struct {
		Token string `json:"token"`
	}
	return func(w http.ResponseWriter, r *http.Request) {
		refreshCookie, err := r.Cookie(refreshCookieName)
		if err != nil {
			http.Error(w, fmt.Sprintf("Could not find refresh cookie - %v", err), http.StatusInternalServerError)
			return
		}
		newAccessToken, err := h.auth.RefreshJWT(refreshCookie.Value)
		if err != nil {
			http.Error(w, err.Error(), http.StatusUnauthorized)
			return
		}
		writeJSON(w, refreshForNextResponse{
			Token: newAccessToken,
		})
	}
}

func (h *handlers) RegisterNewUser() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()
		var newUser auth.CreateUserRequest
		err := json.NewDecoder(r.Body).Decode(&newUser)
		if err != nil {
			http.Error(w, "Unable to decode data in request body", http.StatusInternalServerError)
			return
		}
		resp, err := h.auth.CreateUser(&newUser)
		if err != nil {
			http.Error(w, fmt.Sprintf("Unable to create new user - %s", err.Error()), http.StatusInternalServerError)
			return
		}
		h.setAuthCookies(w, resp.Token, resp.RefreshToken)
	}
}

func (h *handlers) setAuthCookies(w http.ResponseWriter, jwt, refresh string) {
	// set authentication tokens as http-only cookies
	if jwt != "" {
		jwtCookie := &http.Cookie{
			Name:     jwtCookieName,
			Value:    jwt,
			Path:     "/",
			HttpOnly: true,
			Expires:  time.Now().AddDate(0, 0, 1),
		}
		if h.env != local {
			// ensure https if not on localhost
			jwtCookie.Domain = medhircom
			jwtCookie.Secure = true
		}
		http.SetCookie(w, jwtCookie)
	}

	if refresh != "" {
		refreshCookie := &http.Cookie{
			Name:     refreshCookieName,
			Value:    refresh,
			Path:     "/",
			HttpOnly: true,
			Expires:  time.Now().AddDate(0, 0, 1),
		}
		if h.env != local {
			refreshCookie.Domain = medhircom
			refreshCookie.Secure = true
		}
		http.SetCookie(w, refreshCookie)
	}
}

func (h *handlers) getJWTCookie(r *http.Request) (string, error) {
	cookie, err := r.Cookie(jwtCookieName)
	if err != nil {
		return "", err
	}
	return cookie.Value, nil
}

func (h *handlers) getUser(r *http.Request) (*gocloak.User, error) {
	jwt, err := h.getJWTCookie(r)
	if err != nil {
		return nil, err
	}
	user, err := h.auth.GetUser(jwt)
	if err != nil {
		return nil, err
	}
	return user, nil
}
