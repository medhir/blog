package instance

import (
	"net/http"

	"github.com/medhir/blog/server/handlers"
)

// AddRoutes registers all the application handlers to their corresponding url prefixes
func (i *Instance) AddRoutes() {
	handlers := handlers.NewHandlers(i.auth, i.gcs)
	// api endpoints
	//	auth
	i.router.HandleFunc("/login", handlers.Login())
	i.router.HandleFunc("/jwt/validate", handlers.ValidateJWT())
	// 	blog
	i.router.HandleFunc("/blog/posts", func(w http.ResponseWriter, r *http.Request) {})
	i.router.HandleFunc("/blog/drafts", func(w http.ResponseWriter, r *http.Request) {})
	i.router.HandleFunc("/blog/post", func(w http.ResponseWriter, r *http.Request) {})
	i.router.HandleFunc("/blog/draft", func(w http.ResponseWriter, r *http.Request) {})
	i.router.HandleFunc("/blog/asset", func(w http.ResponseWriter, r *http.Request) {})
	// 	photos
	i.router.HandleFunc("/photos", handlers.GetPhotos())
}
