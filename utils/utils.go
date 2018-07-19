package utils

import (
	"encoding/json"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
)

type Album struct {
	Name   string
	Images []string
}

const AlbumsPath = "assets/photos"

func Assets(dir string) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "GET" {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}
		path := strings.TrimPrefix(r.URL.Path, "/api/"+dir+"/")

		dir, err := ioutil.ReadDir("assets/" + dir + "/" + path)
		if err != nil {
			http.Error(w, "Cannot read directory.", http.StatusInternalServerError)
		}
		var files []string
		for _, v := range dir {
			files = append(files, v.Name())
		}
		obj, err := json.Marshal(files)
		if err != nil {
			http.Error(w, "Data could not be encoded.", http.StatusInternalServerError)
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(obj)
	})
}

func Albums() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "GET" {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		// get albums from photos
		albums, err := ioutil.ReadDir(AlbumsPath)
		if err != nil {
			http.Error(w, "Could not read photos at "+AlbumsPath, http.StatusInternalServerError)
			return
		}
		var albumsResponse []Album
		for _, album := range albums {
			var albumPath = AlbumsPath + "/" + album.Name()
			photoFiles, err := ioutil.ReadDir(albumPath)
			if err != nil {
				http.Error(w, "Could not read photos at "+albumPath, http.StatusInternalServerError)
				return
			}
			var photoArr []string
			for _, photo := range photoFiles {
				photoArr = append(photoArr, photo.Name())
			}

			albumStruct := Album{
				album.Name(),
				photoArr,
			}
			albumsResponse = append(albumsResponse, albumStruct)
		}

		// write JSON to response
		w.Header().Set("Content-Type", "application/json")
		obj, err := json.Marshal(albumsResponse)
		if err != nil {
			http.Error(w, "Data could not be encoded.", http.StatusInternalServerError)
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
