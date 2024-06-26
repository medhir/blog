package handlers

import (
	"bytes"
	"fmt"
	"github.com/medhir/blog/server/controllers/auth"
	"io"
	"log"
	"net/http"
	"path"
	"strconv"

	"github.com/google/uuid"
	"github.com/medhir/blog/server/controllers/storage/gcs"
)

const (
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
		objects, err := h.gcs.ListObjects(h.gcs.GetDefaultBucket(), prefix)
		if err != nil {
			http.Error(w, fmt.Sprintf("Could not retrieve photos, %v/%v", h.gcs.GetDefaultBucket(), prefix), http.StatusInternalServerError)
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
			http.Error(w, fmt.Sprintf("Could not write images as json: %v", err), http.StatusInternalServerError)
			return
		}
	}
}

func (h *handlers) PostPhoto() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := r.ParseMultipartForm(32 << 20)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
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
				log.Println(err.Error())
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			processedImage, err := h.imgProcessor.ProcessImage(buf.Bytes())
			if err != nil {
				log.Printf("Unable to process image: %s", err.Error())
				http.Error(w, fmt.Sprintf("Unable to process image: %s", err.Error()), http.StatusInternalServerError)
				return
			}
			imageBounds, err := h.imgProcessor.GetImageDimensions(processedImage)
			if err != nil {
				log.Printf("Unable to get image dimensions: %s", err.Error())
				http.Error(w, fmt.Sprintf("Unable to get image dimensions: %s", err.Error()), http.StatusInternalServerError)
				return
			}
			cfImage, err := h.cf.AddImage(processedImage)
			if err != nil {
				log.Printf("Unable to add image to Cloudflare: %s", err.Error())
				http.Error(w, fmt.Sprintf("Unable to add image to Cloudflare: %s", err.Error()), http.StatusInternalServerError)
				return
			}
			blurDataURL, err := h.imgProcessor.GetBlurDataURL(processedImage)
			if err != nil {
				log.Printf("Unable to blur image data: %s", err.Error())
				http.Error(w, fmt.Sprintf("Unable to blur image data: %s", err.Error()), http.StatusInternalServerError)
				return
			}
			id := uuid.New().String()
			objectName := fmt.Sprintf("%s%s.jpg", mediaPrefix, id)
			err = h.gcs.UploadObject(objectName, h.gcs.GetDefaultBucket(), processedImage, true)
			if err != nil {
				log.Printf("Unable to upload image: %s", err.Error())
				http.Error(w, fmt.Sprintf("Unable to upload image: %s", err.Error()), http.StatusInternalServerError)
				return
			}
			err = h.gcs.AddObjectMetadata(objectName, h.gcs.GetDefaultBucket(), map[string]string{
				"type":        string(photoMedia),
				"width":       fmt.Sprintf("%d", imageBounds.Width),
				"height":      fmt.Sprintf("%d", imageBounds.Height),
				"cdnURL":      cfImage.Variants[0],
				"blurDataURL": blurDataURL,
			})
			if err != nil {
				msg := fmt.Sprintf("Unable to add object metadata: %s", err.Error())
				log.Printf(msg)
				http.Error(w, fmt.Sprintf(msg), http.StatusInternalServerError)
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
		metadata, err := h.gcs.GetObjectMetadata(objectName, h.gcs.GetDefaultBucket())
		if err != nil {
			http.Error(w, fmt.Sprintf("Unable to get image metadata: %s", err.Error()), http.StatusInternalServerError)
			return
		}
		err = h.cf.DeleteImage(metadata.Metadata["cdnURL"])
		if err != nil {
			http.Error(w, fmt.Sprintf("Unable to delete cdn image: %s", err.Error()), http.StatusInternalServerError)
			return
		}
		err = h.gcs.DeleteObject(objectName, h.gcs.GetDefaultBucket())
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
			h.Authorize(auth.BlogOwner, h.PostPhoto())(w, r)
		case http.MethodDelete:
			h.Authorize(auth.BlogOwner, h.DeletePhoto())(w, r)
		default:
			http.Error(w, fmt.Sprintf(unimplementedHttpHandlerMessage, r.Method), http.StatusMethodNotAllowed)
		}
	}
}
