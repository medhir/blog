package main

import (
	"crypto/rand"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"mime"
	"net/http"
	"os"
	"path/filepath"
)

const maxUploadSize = 20 * 1024 // 20 MB

func randToken(len int) string {
	b := make([]byte, len)
	rand.Read(b)
	return fmt.Sprintf("%x", b)
}

func serveIndex(w http.ResponseWriter, r *http.Request) {
	index, err := ioutil.ReadFile("build/index.html")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	w.Write(index)
}

func uploadFileHandler(path string) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "POST" {
			http.Error(w, "Must be POST request", http.StatusBadRequest)
		}
		// check file size
		r.Body = http.MaxBytesReader(w, r.Body, maxUploadSize)
		if err := r.ParseMultipartForm(maxUploadSize); err != nil {
			http.Error(w, "Filesize exceeds 20MB limit.", http.StatusBadRequest)
			return
		}
		// get file from form
		file, _, err := r.FormFile("photo")
		if err != nil {
			http.Error(w, "Invalid file.", http.StatusBadRequest)
			return
		}
		defer file.Close()
		// sniff file bytes for MIME type
		fileBytes, err := ioutil.ReadAll(file)
		if err != nil {
			http.Error(w, "Invalid file.", http.StatusBadRequest)
			return
		}
		// check file type
		fileType := http.DetectContentType(fileBytes)
		switch fileType {
		case "image/jpeg", "image/jpg":
		case "image/gif", "image/png":
			break
		default:
			http.Error(w, "File type must be .jpeg, .jpg, .gif, or .png", http.StatusBadRequest)
			return
		}
		// generate file name
		fileName := randToken(12)
		fileEndings, err := mime.ExtensionsByType(fileType)
		if err != nil {
			http.Error(w, "Cannot read file type", http.StatusInternalServerError)
			return
		}
		newPath := filepath.Join(path, fileName+fileEndings[0])
		fmt.Printf("FileType: %s File: %s\n", fileType, newPath)
		// write file
		newFile, err := os.Create(newPath)
		if err != nil {
			http.Error(w, "Cannot write file.", http.StatusInternalServerError)
			return
		}
		defer newFile.Close()
		if _, err := newFile.Write(fileBytes); err != nil || newFile.Close() != nil {
			http.Error(w, "Cannot write file.", http.StatusInternalServerError)
			return
		}
		w.Write([]byte("Success!"))
	})
}

// type PhotoInfo []struct {
// 	name string
// 	size int64
// }

func getFileNames(path string) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "GET" {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}
		dir, err := ioutil.ReadDir(path)
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

func main() {
	// index.html
	http.HandleFunc("/", serveIndex)

	// CORS config
	// c := cors.New(cors.Options{
	// 	Debug:            true,
	// 	AllowCredentials: true,
	// })
	// photo uploader
	http.HandleFunc("/uploadphoto", uploadFileHandler("/static/photos"))

	// static files
	staticfs := http.FileServer(http.Dir("build/static"))
	http.Handle("/static/", http.StripPrefix("/static/", staticfs))
	assetsfs := http.FileServer(http.Dir("assets"))
	http.Handle("/assets/", http.StripPrefix("/assets/", assetsfs))

	// photo name API
	http.Handle("/api/photos/", getFileNames("./assets/photos"))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}
	log.Println("Listening on port " + port)
	http.ListenAndServe(":"+port, nil)
}
