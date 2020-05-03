package handlers

import (
	"fmt"
	"net/http"

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
