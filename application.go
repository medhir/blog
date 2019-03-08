package main

import (
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/medhir/blog/api"
	"github.com/rs/cors"

	// Provide runtime profiling data
	// https://golang.org/pkg/net/http/pprof/

	_ "net/http/pprof"
)

func serveIndex(w http.ResponseWriter, r *http.Request) {
	index, err := ioutil.ReadFile("build/index.html")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	w.Write(index)
}

func main() {
	// index.html
	http.HandleFunc("/", serveIndex)

	// CORS config for development purposes
	c := cors.New(cors.Options{
		Debug:            true,
		AllowCredentials: true,
		AllowedMethods:   []string{http.MethodGet, http.MethodPost, http.MethodPut}})

	// static js,css
	staticfs := http.FileServer(http.Dir("build/static"))
	http.Handle("/static/", http.StripPrefix("/static/", staticfs))
	// asset files
	assetsfs := http.FileServer(http.Dir("assets/"))
	http.Handle("/assets/", http.StripPrefix("/assets/", assetsfs))

	// blog API
	http.HandleFunc("/api/blog/posts", api.GetBlogPosts())
	http.HandleFunc("/api/blog/draft", api.GetBlogDraft())
	// blog draft editing API
	http.HandleFunc("/api/blog/draft/edit", api.PutBlogDraft())
	// photo name API
	http.HandleFunc("/api/photos", api.GetPhotos())
	// album API
	http.HandleFunc("/api/albums/", api.GetAlbums())
	// uploader service
	http.HandleFunc("/api/upload/", api.UploadPhoto())

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	log.Println("Listening on port " + port)
	enableCORS := c.Handler(http.DefaultServeMux)
	// Allow CORS Headers for development
	_, dev := os.LookupEnv("REACT_APP_DEBUG_HOST")
	if dev {
		http.ListenAndServe(":"+port, enableCORS)
	} else {
		http.ListenAndServe(":"+port, nil)
	}
}
