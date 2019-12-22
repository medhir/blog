package server

import "net/http"

func (i *instance) addRoutes() {
	// static resources
	i.router.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("build/static"))))
	i.router.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("assets"))))

	// site handlers
	i.router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {})
	i.router.HandleFunc("/blog", func(w http.ResponseWriter, r *http.Request) {})

	// api endpoints
	//	auth
	i.router.HandleFunc("/api/login", func(w http.ResponseWriter, r *http.Request) {})
	i.router.HandleFunc("/api/jwt/validate", func(w http.ResponseWriter, r *http.Request) {})
	// 	blog
	i.router.HandleFunc("/api/blog/posts", func(w http.ResponseWriter, r *http.Request) {})
	i.router.HandleFunc("/api/blog/drafts", func(w http.ResponseWriter, r *http.Request) {})
	i.router.HandleFunc("/api/blog/post", func(w http.ResponseWriter, r *http.Request) {})
	i.router.HandleFunc("/api/blog/draft", func(w http.ResponseWriter, r *http.Request) {})
	i.router.HandleFunc("/api/blog/asset", func(w http.ResponseWriter, r *http.Request) {})
	// 	photos
	i.router.HandleFunc("/api/photo", func(w http.ResponseWriter, r *http.Request) {})
	i.router.HandleFunc("/api/photos", func(w http.ResponseWriter, r *http.Request) {})
}
