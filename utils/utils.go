package utils

import (
	"encoding/json"
	"io"
	"net/http"
	"os"
)

type Album struct {
	Name string
}

const AlbumsPath = "assets/photos"

func Albums() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "GET" {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		// get albums from photos
		albums, err := ListAlbums()
		if err != nil {
			http.Error(w, "Could not objects at s3 bucket "+BUCKET_NAME, http.StatusInternalServerError)
			return
		}

		// write JSON to response
		w.Header().Set("Content-Type", "application/json")
		obj, err := json.Marshal(albums)
		if err != nil {
			http.Error(w, "Data could not be encoded.", http.StatusInternalServerError)
		}
		w.WriteHeader(http.StatusOK)
		w.Write(obj)
	})
}

func Photos() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		// Get album param from URL
		album := r.URL.Query().Get("album")
		// Use AWS util method to get photo keys
		photoKeys, err := GetPhotoKeysForAlbum(album)
		if err != nil {
			http.Error(w, "Photo keys could not be retreived", http.StatusInternalServerError)
			return
		}
		// Write response as JSON
		w.Header().Set("Content-Type", "application/json")
		obj, err := json.Marshal(photoKeys)
		if err != nil {
			http.Error(w, "Data could not be encoded.", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write(obj)
	})
}

func Upload() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		r.ParseMultipartForm(32 << 20)
		fhs := r.MultipartForm.File["uploads"]
		for _, fh := range fhs {
			file, err := fh.Open()
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			defer file.Close()
			f, err := os.OpenFile("./test"+fh.Filename, os.O_WRONLY|os.O_CREATE, 0666)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
			defer f.Close()
			io.Copy(f, file)
			w.WriteHeader(http.StatusOK)
		}
	})
}
