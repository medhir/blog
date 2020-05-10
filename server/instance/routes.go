package instance

import (
	"net/http"

	"gitlab.medhir.com/medhir/blog/server/handlers"
)

// AddRoutes registers all the application handlers to their corresponding url prefixes
func (i *Instance) AddRoutes() error {
	h, err := handlers.NewHandlers(i.ctx, i.auth, i.gcs, i.env)
	if err != nil {
		return err
	}
	// api endpoints
	//	auth
	i.router.HandleFunc("/login", h.Login())
	i.router.HandleFunc("/jwt/validate", h.ValidateJWT())
	// 	blog
	i.router.HandleFunc("/blog/asset", func(w http.ResponseWriter, r *http.Request) {})
	i.router.HandleFunc("/blog/drafts", h.Authorize(h.GetDrafts()))
	i.router.HandleFunc("/blog/draft", h.Authorize(h.HandleDraft()))
	i.router.HandleFunc("/blog/post/", h.GetPost())
	i.router.HandleFunc("/blog/posts", h.GetPosts())
	// 	photos
	i.router.HandleFunc("/photos", h.GetPhotos())
	i.router.HandleFunc("/photo", h.HandlePhoto())
	//	coder
	i.router.HandleFunc("/coder", h.HandleCoder())

	return nil
}
