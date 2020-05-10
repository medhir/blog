package handlers

import (
	"fmt"
	"net/http"
	"path"
)

func (h *handlers) GetDraft() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := path.Base(r.URL.Path)
		draft, err := h.blog.GetDraft(id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		sendJSON(w, draft)
	}
}

func (h *handlers) PostDraft() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

	}
}

func (h *handlers) PatchDraft() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

	}
}

func (h *handlers) HandleDraft() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			h.GetDraft()(w, r)
		case http.MethodPost:
			h.PostDraft()(w, r)
		case http.MethodPatch:
			h.PatchDraft()(w, r)
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
		sendJSON(w, drafts)
	}
}

func (h *handlers) GetPost() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := path.Base(r.URL.Path)
		post, err := h.blog.GetPost(id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		sendJSON(w, post)
	}
}

func (h *handlers) GetPosts() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		posts, err := h.blog.GetPosts()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		sendJSON(w, posts)
	}
}
