package main

import (
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/medhir/blog/utils"
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
	})

	// static js,css
	staticfs := http.FileServer(http.Dir("build/static"))
	http.Handle("/static/", http.StripPrefix("/static/", staticfs))
	// asset files
	assetsfs := http.FileServer(http.Dir("assets/"))
	http.Handle("/assets/", http.StripPrefix("/assets/", assetsfs))

	// photo name API
	http.HandleFunc("/api/photos", utils.Photos())
	// album API
	http.HandleFunc("/api/albums/", utils.Albums())
	// uploader service
	http.HandleFunc("/api/upload/", utils.Upload())

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	log.Println("Listening on port " + port)
	enableCORS := c.Handler(http.DefaultServeMux)
	http.ListenAndServe(":"+port, enableCORS)
}
