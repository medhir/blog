package main

import (
	"crypto/tls"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/medhir/blog/api"
	"github.com/rs/cors"
	"golang.org/x/crypto/acme"
	"golang.org/x/crypto/acme/autocert"

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
	mux := http.NewServeMux()
	// serve index
	mux.HandleFunc("/", serveIndex)

	// CORS config for development purposes
	c := cors.New(cors.Options{
		Debug:            true,
		AllowCredentials: true,
		AllowedMethods:   []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete},
		AllowedHeaders:   []string{"Authorization", "Content-Type"}})

	// static js,css
	staticfs := http.FileServer(http.Dir("build/static"))
	mux.Handle("/static/", http.StripPrefix("/static/", staticfs))
	// asset files
	assetsfs := http.FileServer(http.Dir("assets/"))
	mux.Handle("/assets/", http.StripPrefix("/assets/", assetsfs))

	// blog views
	mux.HandleFunc("/blog", api.GetIndex())
	mux.HandleFunc("/blog/post/", api.GetPost())

	// blog API
	mux.HandleFunc("/api/blog/posts", api.GetBlogPosts())
	mux.HandleFunc("/api/blog/draft", api.Authorize(api.GetBlogDraft()))
	// blog draft editing API
	mux.HandleFunc("/api/blog/draft/", api.HandleBlogDraft())
	mux.HandleFunc("/api/blog/post/", api.HandleBlogPost())
	mux.HandleFunc("/api/blog/assets/", api.HandleBlogAssetUpload())
	// photo API
	mux.HandleFunc("/api/photos", api.GetPhotos())
	mux.HandleFunc("/api/photo", api.Authorize(api.DeletePhoto()))
	// album API
	mux.HandleFunc("/api/albums/", api.GetAlbums())
	// photos uploader service
	mux.HandleFunc("/api/upload/", api.Authorize(api.UploadPhoto("albums/main/")))
	// auth API
	mux.HandleFunc("/api/login", api.Login())
	mux.HandleFunc("/api/jwt/validate", api.CheckExpiry())

	if port := os.Getenv("PORT"); port == "" {
		port = "9000"
	}

	enableCORS := c.Handler(mux)
	// Allow CORS Headers for development
	_, dev := os.LookupEnv("REACT_APP_DEBUG_HOST")
	if dev {
		server := &http.Server{
			Addr:    ":" + port,
			Handler: enableCORS}
		log.Println("Listening on port " + port)
		err := server.ListenAndServeTLS("cert.pem", "key.pem")
		if err != nil {
			log.Fatal(err)
		}
	} else {
		certManager := autocert.Manager{
			Prompt: autocert.AcceptTOS,
			Cache:  autocert.DirCache("cert-cache"),
			// Put your domain here:
			HostPolicy: autocert.HostWhitelist("dev.medhir.com", "stage.medhir.com", "medhir.com"),
		}
		// const AcmeURL = "https://acme-staging-v02.api.letsencrypt.org/directory"
		// TODO: Add staging environment
		certManager.Client = &acme.Client{}
		server := &http.Server{
			Addr:    ":443",
			Handler: mux,
			TLSConfig: &tls.Config{
				GetCertificate: certManager.GetCertificate,
			},
		}
		log.Println("Listening on ports 80 and 443")
		go http.ListenAndServe(":80", certManager.HTTPHandler(nil))
		err := server.ListenAndServeTLS("", "")
		if err != nil {
			log.Fatal(err)
		}
	}
}
