package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"

	client "github.com/FusionAuth/fusionauth-go-client/pkg/fusionauth"
)

const host = "https://auth.medhir.com"

var (
	apiKey, _        = os.LookupEnv("FUSIONAUTH_API_KEY")
	applicationID, _ = os.LookupEnv("BLOG_AUTH_APPLICATION_ID")
	baseURL, _       = url.Parse(host)
	auth             = &client.FusionAuthClient{
		BaseURL:    baseURL,
		APIKey:     apiKey,
		HTTPClient: httpClient,
	}
)

// Credentials describes the JSON request for a user login
type Credentials struct {
	LoginID  string `json:"loginId"`
	Password string `json:"password"`
}

func isValid(response *client.ValidateResponse) bool {
	if response.StatusCode != http.StatusOK {
		return false
	}
	return true
}

// Login logs in the user
func Login() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Read body
		var credentials Credentials
		defer r.Body.Close()
		json.NewDecoder(r.Body).Decode(&credentials)
		authResponse, _, err := auth.Login(client.LoginRequest{
			BaseLoginRequest: client.BaseLoginRequest{
				ApplicationId: applicationID,
			},
			LoginId:  credentials.LoginID,
			Password: credentials.Password,
		})
		if err != nil {
			http.Error(w, fmt.Sprintf("Auth Login Failed: %v", err.Error()), http.StatusBadRequest)
			return
		}
		responseJSON, err := json.Marshal(authResponse)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(responseJSON)
	})
}

// Authorize validates a request by checking for a valid jwt in the authorization header
func Authorize(h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		jwt := r.Header.Get("Authorization")
		validateResponse, err := auth.ValidateJWT(jwt)
		if !isValid(validateResponse) {
			http.Error(w, "Invalid access token", http.StatusBadRequest)
			return
		}
		if err != nil {
			http.Error(w, "Could not validate JWT - "+err.Error(), http.StatusBadRequest)
			return
		}
		h(w, r)
	}
}

// CheckExpiry validates that the provided JWT is valid for authenticating a user
func CheckExpiry() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		jwt := r.Header.Get("Authorization")
		validateResponse, err := auth.ValidateJWT(jwt)
		if !isValid(validateResponse) {
			http.Error(w, "Invalid access token", http.StatusBadRequest)
			return
		}
		if err != nil {
			http.Error(w, "Could not validate JWT - "+err.Error(), http.StatusBadRequest)
			return
		}
		responseJSON, err := json.Marshal(validateResponse)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(responseJSON)
	}
}
