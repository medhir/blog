package instance

import (
	"github.com/medhir/blog/server/controllers/auth"
	"github.com/medhir/blog/server/handlers"
)

// AddRoutes registers all the application handlers to their corresponding url prefixes
func (i *Instance) AddRoutes() error {
	h, err := handlers.NewHandlers(i.ctx, i.auth, i.gcs, i.cf, i.db, i.env)
	if err != nil {
		return err
	}
	// api endpoints
	//	auth
	i.router.HandleFunc("/login", h.Login())
	i.router.HandleFunc("/jwt/validate/", h.ValidateJWT())
	i.router.HandleFunc("/jwt/refresh", h.RefreshJWT())
	i.router.HandleFunc("/jwt/next/refresh", h.RefreshForNext())
	i.router.HandleFunc("/register", h.RegisterNewUser())
	i.router.HandleFunc("/password_reset", h.HandleResetPassword())
	//	database
	i.router.HandleFunc("/migrate/up", h.Authorize(auth.BlogOwner, h.MigrateUp()))
	i.router.HandleFunc("/migrate/down", h.Authorize(auth.BlogOwner, h.MigrateDown()))
	i.router.HandleFunc("/migrate/blog", h.Authorize(auth.BlogOwner, h.MigrateBlog()))
	i.router.HandleFunc("/migrate/version", h.Authorize(auth.BlogOwner, h.DatabaseVersion()))
	// 	blog
	i.router.HandleFunc("/blog/draft/", h.Authorize(auth.BlogOwner, h.HandleDraft()))
	i.router.HandleFunc("/blog/drafts", h.Authorize(auth.BlogOwner, h.GetDrafts()))
	i.router.HandleFunc("/blog/post/", h.HandlePost())
	i.router.HandleFunc("/blog/posts", h.GetPosts())
	i.router.HandleFunc("/blog/asset/", h.Authorize(auth.BlogOwner, h.HandleAsset()))
	i.router.HandleFunc("/blog/assets/", h.Authorize(auth.BlogOwner, h.HandleAssets()))
	// 	photos
	i.router.HandleFunc("/photos/", h.HandlePhotos())
	return nil
}
