package utils

import (
	"encoding/json"
	"io"
	"io/ioutil"
	"net/http"
	"os"
)

func FileNames(path string) http.HandlerFunc {
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

func Upload(path string) http.Handler {
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
		}
	})
}
