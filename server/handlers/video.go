package handlers

import (
	"fmt"
	"github.com/medhir/blog/server/controllers/auth"
	muxgo "github.com/muxinc/mux-go"
	"log"
	"net/http"
)

func (h *handlers) getVideoURL() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		assetRequest := muxgo.CreateAssetRequest{PlaybackPolicy: []muxgo.PlaybackPolicy{muxgo.PUBLIC}}
		uploadRequest := muxgo.CreateUploadRequest{NewAssetSettings: assetRequest, Timeout: 3600, CorsOrigin: "*"}

		upload, err := h.video.DirectUploadsApi.CreateDirectUpload(uploadRequest)
		if err != nil {
			msg := fmt.Sprintf("cannot create video upload URL %s", err.Error())
			log.Println(msg)
			http.Error(w, msg, http.StatusInternalServerError)
			return
		}
		err = writeJSON(w, upload.Data)
		if err != nil {
			msg := fmt.Sprintf("cannot write JSON: %s", err.Error())
			log.Println(msg)
			http.Error(w, msg, http.StatusInternalServerError)
			return
		}
	}
}

func (h *handlers) HandleVideo() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			h.Authorize(auth.BlogOwner, h.getVideoURL())(w, r)
		default:
			http.Error(w, fmt.Sprintf("unimplemented http handler for method %s", r.Method), http.StatusMethodNotAllowed)
		}
	}
}
