package handlers

import (
	"fmt"
	"github.com/medhir/blog/server/controllers/storage/gcs"
	"net/http"
	"path"
	"strconv"
)

type media string

const (
	photoMedia  = media("photo")
	videoMedia  = media("video")
	mediaPrefix = "media/"
)

type mediaData struct {
	Name          string `json:"name"`
	Type          string `json:"type"`
	URL           string `json:"url"`
	MuxPlaybackID string `json:"muxPlaybackID,omitempty"`
	Width         int    `json:"width,omitempty"`
	Height        int    `json:"height,omitempty"`
	BlurDataURL   string `json:"blurDataURL,omitempty"`
}

func (h *handlers) getMedia() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		objects, err := h.gcs.ListObjects(h.gcs.GetDefaultBucket(), mediaPrefix)
		if err != nil {
			http.Error(w, fmt.Sprintf("Could not retrieve media, %v/%v", h.gcs.GetDefaultBucket(), mediaPrefix), http.StatusInternalServerError)
			return
		}
		objects.Sort(gcs.ByDateDescending)
		mediaList := make([]mediaData, 0, len(objects))
		for _, object := range objects {
			switch media(object.Metadata["type"]) {
			case photoMedia:
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
				data := mediaData{
					Name:        path.Base(object.Name),
					Type:        string(photoMedia),
					URL:         object.Metadata["cdnURL"],
					Width:       width,
					Height:      height,
					BlurDataURL: object.Metadata["blurDataURL"],
				}
				mediaList = append(mediaList, data)
			case videoMedia:
				data := mediaData{
					Name:          path.Base(object.Name),
					Type:          string(videoMedia),
					MuxPlaybackID: object.Metadata["muxPlaybackID"],
					URL:           object.Metadata["muxURL"],
				}
				mediaList = append(mediaList, data)
			default:
				http.Error(w, fmt.Sprintf("unable to process media, unsupported type %s", object.Metadata["type"]), http.StatusInternalServerError)
				return
			}
		}
		err = writeJSON(w, mediaList)
		if err != nil {
			http.Error(w, fmt.Sprintf("Could not write media as json: %v", err), http.StatusInternalServerError)
			return
		}
	}
}

func (h *handlers) HandleMedia() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			h.getMedia()(w, r)
		default:
			http.Error(w, fmt.Sprintf(unimplementedHttpHandlerMessage, r.Method), http.StatusMethodNotAllowed)
		}
	}
}
