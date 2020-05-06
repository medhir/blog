package handlers

import (
	"bytes"
	"fmt"
	"github.com/google/uuid"
	"io"
	"net/http"
	"path"

	"gitlab.medhir.com/medhir/blog/server/storage/gcs"
)

const (
	bucket = "medhir-com"
	prefix = "photos/"
)

func (h *handlers) GetPhotos() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		objects, err := h.gcs.ListObjects(bucket, prefix)
		if err != nil {
			http.Error(w, fmt.Sprintf("Could not retrieve photos, %v/%v", bucket, prefix), http.StatusInternalServerError)
			return
		}
		objects.Sort(gcs.ByDateDescending)
		imageUrls := make([]string, 0, len(objects))
		for _, object := range objects {
			imageUrls = append(imageUrls, object.URL)
		}
		err = writeJSON(w, imageUrls)
		if err != nil {
			http.Error(w, fmt.Sprintf("Could not write image urls as json: %v", err), http.StatusInternalServerError)
			return
		}
	}
}

func (h *handlers) PostPhoto() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		r.ParseMultipartForm(32 << 20)
		fileHeaders := r.MultipartForm.File["photo"]
		for _, fileHeader := range fileHeaders {
			file, err := fileHeader.Open()
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			defer file.Close()
			buf := bytes.NewBuffer(nil)
			_, err = io.Copy(buf, file)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			processedImage, err := h.imgProcessor.ProcessImage(buf.Bytes())
			if err != nil {
				http.Error(w, fmt.Sprintf("Unable to process image: %s", err.Error()), http.StatusInternalServerError)
				return
			}
			id := uuid.New().String()
			objectName := fmt.Sprintf("%s%s.jpg", prefix, id)
			err = h.gcs.UploadObject(objectName, bucket, processedImage, true)
			if err != nil {
				http.Error(w, fmt.Sprintf("Unable to upload image: %s", err.Error()), http.StatusInternalServerError)
				return
			}
		}
		w.WriteHeader(http.StatusOK)
	}
}

func (h *handlers) DeletePhoto() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := path.Base(r.URL.Path)
		objectName := fmt.Sprintf("%s%s.jpg", prefix, id)
		err := h.gcs.DeleteObject(objectName, bucket)
		if err != nil {
			http.Error(w, fmt.Sprintf("Unable to delete image: %s", err.Error()), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	}
}

func (h *handlers) HandlePhoto() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			h.PostPhoto()(w, r)
		case http.MethodDelete:
			h.DeletePhoto()(w, r)
		default:
			http.Error(w, fmt.Sprintf("unimplemented http handler for method %s", r.Method), http.StatusMethodNotAllowed)
		}
	}
}
