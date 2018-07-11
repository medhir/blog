package main

import (
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"medhir/utils"

	"github.com/rs/cors"
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

	// CORS config
	c := cors.New(cors.Options{
		Debug:            true,
		AllowCredentials: true,
	})

	// photo uploader
	// http.HandleFunc("/api/photos/upload/", uploadFile("/assets/photos"))

	// staticjsetc
	staticfs := http.FileServer(http.Dir("build/static"))
	http.Handle("/static/", http.StripPrefix("/static/", staticfs))
	// static files
	assetsfs := http.FileServer(http.Dir("assets/"))
	http.Handle("/assets/", http.StripPrefix("/assets/", assetsfs))

	// photo name API
	http.HandleFunc("/api/photos/", utils.FileNames("./assets/photos"))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}
	log.Println("Listening on port " + port)
	corsEnabled := c.Handler(http.DefaultServeMux)
	http.ListenAndServe(":"+port, corsEnabled)
}
