package handlers

import (
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	"github.com/medhir/blog/server/controllers/auth"
	muxgo "github.com/muxinc/mux-go"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"
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

func (h *handlers) postVideo() http.HandlerFunc {
	type videoData struct {
		ID  string `json:"id"`
		URL string `json:"url"`
	}
	return func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()
		var data videoData
		err := json.NewDecoder(r.Body).Decode(&data)
		if err != nil {
			http.Error(w, fmt.Sprintf("unable to decode data in request body: %s", err.Error()), http.StatusBadRequest)
			return
		}
		// Validate URL
		_, err = url.ParseRequestURI(data.URL)
		if err != nil {
			http.Error(w, fmt.Sprintf("invalid URL: %s", err.Error()), http.StatusBadRequest)
			return
		}
		muxUploadData, err := h.video.DirectUploadsApi.GetDirectUpload(data.ID)
		if err != nil {
			msg := fmt.Sprintf("unable to get upload data for ID %s: %s", data.ID, err.Error())
			log.Println(msg)
			http.Error(w, msg, http.StatusInternalServerError)
			return
		}
		muxAssetID := muxUploadData.Data.AssetId
		var muxAsset muxgo.AssetResponse
		for {
			muxAsset, err = h.video.AssetsApi.GetAsset(muxAssetID)
			if err != nil {
				msg := fmt.Sprintf("unable to get mux asset for assetID %s: %s", muxAssetID, err.Error())
				log.Println(msg)
				http.Error(w, msg, http.StatusInternalServerError)
				return
			}
			if muxAsset.Data.Status != "preparing" {
				break
			}
			time.Sleep(1 * time.Second)
		}
		playbackID := muxAsset.Data.PlaybackIds[0].Id
		aspectRatio := strings.Join(strings.Split(muxAsset.Data.AspectRatio, ":"), " / ")
		objectName := fmt.Sprintf("%s%s", mediaPrefix, uuid.New().String())
		err = h.gcs.UploadObject(objectName, h.gcs.GetDefaultBucket(), []byte{}, true)
		if err != nil {
			msg := fmt.Sprintf("unable to upload video object: %s", err.Error())
			log.Println(msg)
			http.Error(w, msg, http.StatusInternalServerError)
			return
		}
		err = h.gcs.AddObjectMetadata(objectName, h.gcs.GetDefaultBucket(), map[string]string{
			"type":           string(videoMedia),
			"muxAspectRatio": aspectRatio,
			"muxPlaybackID":  playbackID,
			"muxURL":         data.URL,
		})
		if err != nil {
			msg := fmt.Sprintf("unable to add object metadata: %s", err.Error())
			log.Println(msg)
			http.Error(w, msg, http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	}
}

func (h *handlers) HandleVideo() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			h.Authorize(auth.BlogOwner, h.getVideoURL())(w, r)
		case http.MethodPost:
			h.Authorize(auth.BlogOwner, h.postVideo())(w, r)
		default:
			http.Error(w, fmt.Sprintf("unimplemented http handler for method %s", r.Method), http.StatusMethodNotAllowed)
		}
	}
}
