package instance

import (
	"gitlab.com/medhir/blog/server/auth"
	"gitlab.com/medhir/blog/server/handlers"
)

// AddRoutes registers all the application handlers to their corresponding url prefixes
func (i *Instance) AddRoutes() error {
	h, err := handlers.NewHandlers(i.ctx, i.auth, i.gcs, i.db, i.env)
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
	//	database
	i.router.HandleFunc("/migrate/up", h.Authorize(auth.BlogOwner, h.MigrateUp()))
	i.router.HandleFunc("/migrate/down", h.Authorize(auth.BlogOwner, h.MigrateDown()))
	i.router.HandleFunc("/migrate/blog", h.Authorize(auth.BlogOwner, h.MigrateBlog()))
	// 	blog
	i.router.HandleFunc("/blog/asset/", h.Authorize(auth.BlogOwner, h.HandleAsset()))
	i.router.HandleFunc("/blog/assets/", h.Authorize(auth.BlogOwner, h.HandleAssets()))
	i.router.HandleFunc("/blog/draft/", h.Authorize(auth.BlogOwner, h.HandleDraft()))
	i.router.HandleFunc("/blog/drafts", h.Authorize(auth.BlogOwner, h.GetDrafts()))
	i.router.HandleFunc("/blog/post/", h.HandlePost())
	i.router.HandleFunc("/blog/posts", h.GetPosts())
	// 	photos
	i.router.HandleFunc("/photos/", h.HandlePhotos())
	//	code
	i.router.HandleFunc("/code/", h.Authorize(auth.BlogOwner, h.HandleCodeDeployment()))
	//  course
	i.router.HandleFunc("/courses/", h.Authorize(auth.BlogOwner, h.HandleCourses()))
	// lesson
	i.router.HandleFunc("/lessons/", h.Authorize(auth.BlogOwner, h.HandleLessons()))
	return nil
}
