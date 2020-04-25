package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/medhir/blog/server/auth"
)

// Credentials describes the JSON request for a user login
type Credentials struct {
	LoginID  string `json:"loginId"`
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
		// set authentication token as an http-only cookie
		authCookie := &http.Cookie{
			Name:     "tr4x2ki0ptz",
			Value:    authResponse.Token,
			HttpOnly: true,
		}
		http.SetCookie(w, authCookie)
		w.WriteHeader(http.StatusOK)
	}
}

// Authorize is a middleware that checks the validity of a jwt before proceeding with a request
func (h *handlers) Authorize(handler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("tr4x2ki0ptz")
		if err != nil {
			http.Error(w, fmt.Sprintf("Could not find authorization cookie - %v", err), http.StatusInternalServerError)
			return
		}
		err = h.auth.Validate(cookie.Value)
		if err != nil {
			http.Error(w, "Could not validate authorization token", http.StatusInternalServerError)
			return
		}
		handler(w, r)
	}
}

// ValidateJWT indicates whether or not an application has a valid authentication token
func (h *handlers) ValidateJWT() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("tr4x2ki0ptz")
		if err != nil {
			http.Error(w, fmt.Sprintf("Could not find authorization cookie - %v", err), http.StatusInternalServerError)
			return
		}
		err = h.auth.Validate(cookie.Value)
		if err != nil {
			http.Error(w, "Could not validate authorization token", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	}
}
