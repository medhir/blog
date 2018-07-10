package uploader

import (
	"io"
	"net/http"
	"os"
)

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
