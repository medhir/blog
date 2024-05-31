package handlers

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"path"
	"strconv"

	"github.com/google/uuid"
	"github.com/medhir/blog/server/controllers/storage/gcs"
)

const (
	bucket = "medhir-com"
	prefix = "photos/"
)

func (h *handlers) GetPhotos() http.HandlerFunc {
	type photoData struct {
		Name        string `json:"name"`
		URL         string `json:"url"`
		Width       int    `json:"width"`
		Height      int    `json:"height"`
		BlurDataURL string `json:"blurDataURL"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		objects, err := h.gcs.ListObjects(bucket, prefix)
		if err != nil {
			http.Error(w, fmt.Sprintf("Could not retrieve photos, %v/%v", bucket, prefix), http.StatusInternalServerError)
			return
		}
		objects.Sort(gcs.ByDateDescending)
		imageData := make([]photoData, 0, len(objects))
		for _, object := range objects {
			width, err := strconv.Atoi(object.Metadata["width"])
			if err != nil {
				http.Error(w, fmt.Sprintf("could not convert width to int"), http.StatusInternalServerError)
				return
			}
			height, err := strconv.Atoi(object.Metadata["height"])
			if err != nil {
				http.Error(w, fmt.Sprintf("could not convert height to int"), http.StatusInternalServerError)
				return
			}
			data := photoData{
				Name:        path.Base(object.Name),
				URL:         object.Metadata["cdnURL"],
				Width:       width,
				Height:      height,
				BlurDataURL: object.Metadata["blurDataURL"],
			}
			imageData = append(imageData, data)
		}
		err = writeJSON(w, imageData)
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
		key := path.Base(r.URL.Path)
		objectName := fmt.Sprintf("%s%s", prefix, key)
		err := h.gcs.DeleteObject(objectName, bucket)
		if err != nil {
			http.Error(w, fmt.Sprintf("Unable to delete image: %s", err.Error()), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	}
}

func (h *handlers) HandlePhotos() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			h.GetPhotos()(w, r)
		case http.MethodPost:
			h.PostPhoto()(w, r)
		case http.MethodDelete:
			h.DeletePhoto()(w, r)
		default:
			http.Error(w, fmt.Sprintf("unimplemented http handler for method %s", r.Method), http.StatusMethodNotAllowed)
		}
	}
}
