package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"path"
	"time"

	"gitlab.medhir.com/medhir/blog/server/auth"
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
		h.setCookies(w, authResponse.Token, authResponse.RefreshToken)
		w.WriteHeader(http.StatusOK)
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
		err = h.auth.ValidateRole(jwtCookie.Value, role)
		if err != nil {
			http.Error(w, err.Error(), http.StatusUnauthorized)
		}
		err = h.auth.ValidateJWT(jwtCookie.Value)
		if err != nil {
			// if this token is not valid, first attempt to refresh the authorization
			refreshCookie, err := r.Cookie(refreshCookieName)
			if err != nil {
				http.Error(w, fmt.Sprintf("authorization token no longer valid - %s", err.Error()), http.StatusInternalServerError)
				return
			}
			newJWT, err := h.auth.RefreshJWT(refreshCookie.Value)
			if err != nil {
				http.Error(w, fmt.Sprintf("could not refresh token - %s", err.Error()), http.StatusInternalServerError)
				return
			}
			// if we successfully get a new access token, set this as the new jwt cookie
			h.setCookies(w, newJWT, "")
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
		err = h.auth.ValidateRole(jwtCookie.Value, auth.Role(role))
		if err != nil {
			http.Error(w, err.Error(), http.StatusUnauthorized)
		}
		err = h.auth.ValidateJWT(jwtCookie.Value)
		if err != nil {
			// if this token is not valid, first attempt to refresh the authorization
			refreshCookie, err := r.Cookie(refreshCookieName)
			if err != nil {
				http.Error(w, fmt.Sprintf("could not get refresh token - %s", err.Error()), http.StatusInternalServerError)
				return
			}
			newJWT, err := h.auth.RefreshJWT(refreshCookie.Value)
			if err != nil {
				http.Error(w, fmt.Sprintf("could not refresh token - %s", err.Error()), http.StatusInternalServerError)
				return
			}
			// if we successfully get a new access token, set this as the new jwt cookie
			h.setCookies(w, newJWT, "")
			w.WriteHeader(http.StatusOK)
		}
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
		h.setCookies(w, resp.Token, resp.RefreshToken)
		w.WriteHeader(http.StatusOK)
	}
}

func (h *handlers) setCookies(w http.ResponseWriter, jwt, refresh string) {
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
