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

// PostLessonRequest describes the parameters needed to create a new lesson
type PostLessonRequest struct {
	CourseID    string `json:"course_id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	MDX         string `json:"mdx"`
}

func (h *handlers) postLesson() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()
		var postLessonRequest PostLessonRequest
		err := json.NewDecoder(r.Body).Decode(&postLessonRequest)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		id := uuid.New().String()
		err = h.db.CreateLesson(
			id,
			postLessonRequest.CourseID,
			postLessonRequest.Title,
			postLessonRequest.Description,
			postLessonRequest.MDX,
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

// PatchLessonRequest describes the parameters needed to update a lesson
type PatchLessonRequest struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	MDX         string `json:"mdx"`
}

func (h *handlers) patchLesson() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()
		var patchLessonRequest PatchLessonRequest
		err := json.NewDecoder(r.Body).Decode(&patchLessonRequest)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		err = h.db.UpdateLesson(
			patchLessonRequest.ID,
			patchLessonRequest.Title,
			patchLessonRequest.Description,
			patchLessonRequest.MDX,
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

func (h *handlers) HandleLessons() http.HandlerFunc {
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
