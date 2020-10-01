package handlers

import (
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	"net/http"
	"path"
)

func (h *handlers) getLesson() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		lessonID := path.Base(r.URL.Path)
		lesson, err := h.db.GetLesson(lessonID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		err = writeJSON(w, lesson)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func (h *handlers) postLesson() http.HandlerFunc {
	type postLessonRequest struct {
		CourseID    string `json:"course_id"`
		Title       string `json:"title"`
		Description string `json:"description"`
		MDX         string `json:"mdx"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()
		var request postLessonRequest
		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		id := uuid.New().String()
		err = h.db.CreateLesson(
			id,
			request.CourseID,
			request.Title,
			request.Description,
			request.MDX,
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		lesson, err := h.db.GetLesson(id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		err = writeJSON(w, lesson)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func (h *handlers) patchLesson() http.HandlerFunc {
	type patchLessonRequest struct {
		ID          string `json:"id"`
		Title       string `json:"title"`
		Description string `json:"description"`
		MDX         string `json:"mdx"`
	}
	return func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()
		var request patchLessonRequest
		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		err = h.db.UpdateLesson(
			request.ID,
			request.Title,
			request.Description,
			request.MDX,
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func (h *handlers) deleteLesson() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		lessonID := path.Base(r.URL.Path)
		err := h.db.DeleteLesson(lessonID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func (h *handlers) HandleLesson() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			h.getLesson()(w, r)
		case http.MethodPost:
			h.postLesson()(w, r)
		case http.MethodPatch:
			h.patchLesson()(w, r)
		case http.MethodDelete:
			h.deleteLesson()(w, r)
		default:
			http.Error(w, fmt.Sprintf("unimplemented method %s", r.Method), http.StatusNotImplemented)
			return
		}
	}
}
