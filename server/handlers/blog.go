package handlers

import (
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
		setJSON(w, draft)
	}
}

func (h *handlers) GetDrafts() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		drafts, err := h.blog.GetDrafts()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		setJSON(w, drafts)
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
		setJSON(w, post)
	}
}

func (h *handlers) GetPosts() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		posts, err := h.blog.GetPosts()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		setJSON(w, posts)
	}
}
