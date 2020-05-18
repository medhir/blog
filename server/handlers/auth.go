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
		// attempt to log in the user
		authResponse, err := h.auth.Login(&auth.LoginRequest{
			UserID:   credentials.LoginID,
			Password: credentials.Password,
		})
		if err != nil {
			http.Error(w, fmt.Sprintf("Error trying to login the user - %v", err), http.StatusInternalServerError)
			return
		}
		// set authentication tokens as http-only cookies
		jwtCookie := &http.Cookie{
			Name:     jwtCookieName,
			Value:    authResponse.Token,
			Path:     "/",
			HttpOnly: true,
			Expires:  time.Now().AddDate(0, 0, 1),
		}
		refreshCookie := &http.Cookie{
			Name:     refreshCookieName,
			Value:    authResponse.RefreshToken,
			Path:     "/",
			HttpOnly: true,
			Expires:  time.Now().AddDate(0, 0, 1),
		}

		if h.env != local {
			// ensure https if not on localhost
			jwtCookie.Domain = medhircom
			jwtCookie.Secure = true
			refreshCookie.Domain = medhircom
			refreshCookie.Secure = true
		}

		http.SetCookie(w, jwtCookie)
		http.SetCookie(w, refreshCookie)
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
			jwtCookie := &http.Cookie{
				Name:     jwtCookieName,
				Value:    newJWT,
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
		// and then proceed with the rest of the authorized code
		handler(w, r)
	}
}

// ValidateJWT indicates whether or not an application has a valid authentication token
func (h *handlers) ValidateJWT() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		jwtCookie, err := r.Cookie(jwtCookieName)
		if err != nil {
			http.Error(w, fmt.Sprintf("Could not find authorization cookie - %v", err), http.StatusInternalServerError)
			return
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
			jwtCookie := &http.Cookie{
				Name:     jwtCookieName,
				Value:    newJWT,
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
			w.WriteHeader(http.StatusOK)
		}
	}
}

// UsernameAvailable describes the response to username checks
type UsernameAvailable struct {
	Available bool `json:"available"`
}

func (h *handlers) Username() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		username := path.Base(r.URL.Path)
		defer r.Body.Close()
		available, err := h.auth.UsernameAvailable(username)
		if err != nil {
			http.Error(w, fmt.Sprintf("unable to query for username - %s", err.Error()), http.StatusInternalServerError)
		}
		writeJSON(w, UsernameAvailable{
			Available: available,
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
		err = h.auth.CreateUser(&newUser)
		if err != nil {
			http.Error(w, fmt.Sprintf("Unable to create new user - %s", err.Error()), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	}
}
