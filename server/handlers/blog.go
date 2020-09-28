package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"path"
)

type draftData struct {
	Title    string `json:"title"`
	Markdown string `json:"markdown"`
}

func (h *handlers) getDraft() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := path.Base(r.URL.Path)
		draft, err := h.blog.GetDraft(id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeJSON(w, draft)
	}
}

func (h *handlers) postDraft() http.HandlerFunc {
	type postDraftResponse struct {
		ID string `json:"id"`
	}
	return func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()
		var data draftData
		err := json.NewDecoder(r.Body).Decode(&data)
		if err != nil {
			http.Error(w, "Unable to decode data in request body", http.StatusInternalServerError)
			return
		}
		if data.Title == "" {
			http.Error(w, "title must be provided", http.StatusBadRequest)
			return
		}
		id, err := h.db.CreateDraft(data.Title, data.Markdown)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeJSON(w, postDraftResponse{
			ID: id,
		})
	}
}

func (h *handlers) patchDraft() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := path.Base(r.URL.Path)
		defer r.Body.Close()
		var data draftData
		err := json.NewDecoder(r.Body).Decode(&data)
		if err != nil {
			http.Error(w, "Unable to decode data in request body", http.StatusInternalServerError)
			return
		}
		if data.Title == "" {
			http.Error(w, "title must be provided", http.StatusBadRequest)
			return
		}
		err = h.db.SaveDraft(id, data.Title, data.Markdown)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func (h *handlers) deleteDraft() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := path.Base(r.URL.Path)
		err := h.blog.DeleteAssets(id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		err = h.db.DeleteDraftOrPost(id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func (h *handlers) HandleDraft() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			h.getDraft()(w, r)
		case http.MethodPost:
			h.postDraft()(w, r)
		case http.MethodPatch:
			h.patchDraft()(w, r)
		case http.MethodDelete:
			h.deleteDraft()(w, r)
		default:
			http.Error(w, fmt.Sprintf("unimplemented http handler for method %s", r.Method), http.StatusMethodNotAllowed)
			return
		}
	}
}

func (h *handlers) GetDrafts() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		drafts, err := h.blog.GetDrafts()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeJSON(w, drafts)
	}
}

func (h *handlers) GetPost() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		slug := path.Base(r.URL.Path)
		post, err := h.blog.GetPostBySlug(slug)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeJSON(w, post)
	}
}

func (h *handlers) PostPost() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

	}
}

func (h *handlers) PatchPost() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

	}
}

func (h *handlers) GetPosts() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		posts, err := h.blog.GetPosts()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeJSON(w, posts)
	}
}

func (h *handlers) postAsset() http.HandlerFunc {
	type postAssetResponse struct {
		URL string `json:"url"`
	}
	return func(w http.ResponseWriter, r *http.Request) {
		id := path.Base(r.URL.Path)
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
			url, err := h.blog.AddAsset(id, processedImage)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			writeJSON(w, postAssetResponse{
				URL: url,
			})
			return
		}
	}
}

func (h *handlers) deleteAsset() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := path.Base(r.URL.Path)
		names, ok := r.URL.Query()["name"]
		if !ok || len(names) < 1 {
			http.Error(w, "name must be provided as a query parameter", http.StatusBadRequest)
			return
		}
		name := names[0]
		err := h.blog.DeleteAsset(id, name)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func (h *handlers) HandleAsset() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			h.postAsset()(w, r)
		case http.MethodDelete:
			h.deleteAsset()(w, r)
		default:
			http.Error(w, fmt.Sprintf("unimplemented http handler for method %s", r.Method), http.StatusMethodNotAllowed)
			return
		}
	}
}

func (h *handlers) getAssets() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := path.Base(r.URL.Path)
		assets, err := h.db.GetAssets(id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeJSON(w, assets)
	}
}

func (h *handlers) HandleAssets() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			h.getAssets()(w, r)
		default:
			http.Error(w, fmt.Sprintf("unimplemented http handler for method %s", r.Method), http.StatusMethodNotAllowed)
			return
		}
	}
}
