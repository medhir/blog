package instance

import (
	"gitlab.com/medhir/blog/server/auth"
	"gitlab.com/medhir/blog/server/handlers"
	"net/http"
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
	i.router.HandleFunc("/jwt/validate/", h.ValidateJWT())
	i.router.HandleFunc("/register", h.RegisterNewUser())
	// 	blog
	i.router.HandleFunc("/blog/asset", func(w http.ResponseWriter, r *http.Request) {})
	i.router.HandleFunc("/blog/drafts", h.Authorize(auth.BlogOwner, h.GetDrafts()))
	i.router.HandleFunc("/blog/draft/", h.Authorize(auth.BlogOwner, h.HandleDraft()))
	i.router.HandleFunc("/blog/post/", h.GetPost())
	i.router.HandleFunc("/blog/posts", h.GetPosts())
	// 	photos
	i.router.HandleFunc("/photos", h.GetPhotos())
	i.router.HandleFunc("/photo", h.HandlePhoto())
	//	coder
	i.router.HandleFunc("/code/instance/", h.Authorize(auth.BlogOwner, h.HandleCodeInstance()))
	i.router.HandleFunc("/code/deployment/", h.Authorize(auth.BlogOwner, h.HandleCodeDeployment()))

	return nil
}
