package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"

	client "github.com/medhir/fusionauth-go-client"
)

const host = "http://localhost:9011"

var apiKey, _ = os.LookupEnv("FUSIONAUTH_APIKEY")
var httpClient = &http.Client{}
var baseURL, _ = url.Parse(host)
var auth = &client.FusionAuthClient{
	BaseURL:    baseURL,
	APIKey:     apiKey,
	HTTPClient: httpClient}

// Credentials describes the JSON request for a user login
type Credentials struct {
	LoginID  string `json:"loginId"`
	Password string `json:"password"`
}

// Login logs in the user
func Login() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Read body
		var credentials Credentials
		defer r.Body.Close()
		json.NewDecoder(r.Body).Decode(&credentials)
		authResponse, err := auth.Login(credentials)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
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
		fmt.Println(jwt)
		_, err := auth.ValidateJWT(jwt)
		if err != nil {
			http.Error(w, "Could not validate JWT - "+err.Error(), http.StatusBadRequest)
			return
		}
		h(w, r)
	}
}
