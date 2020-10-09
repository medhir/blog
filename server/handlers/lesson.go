package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"path"
)

func (h *handlers) getLesson() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		lessonID := path.Base(r.URL.Path)
		user, err := h.getUser(r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		lesson, err := h.tutorials.GetLesson(lessonID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		course, err := h.tutorials.GetCourse(lesson.CourseID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if *user.ID != course.AuthorID {
			http.Error(w, errors.New("unauthorized to view this lesson").Error(), http.StatusUnauthorized)
			return
		}
		instance, err := h.code.SetInstance(user, course.MasterPVCName)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		lesson.InstanceURL = instance.URL
		err = writeJSON(w, lesson)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func (h *handlers) postLesson() http.HandlerFunc {
	type postLessonRequest struct {
		CourseID string `json:"course_id"`
		Title    string `json:"title"`
		MDX      string `json:"mdx"`
	}
	type postLessonResponse struct {
		LessonID string `json:"lesson_id"`
	}
	return func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()
		var request postLessonRequest
		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		// verify user access
		user, err := h.getUser(r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		course, err := h.tutorials.GetCourse(request.CourseID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if *user.ID != course.AuthorID {
			http.Error(w, errors.New("unauthorized to create this lesson").Error(), http.StatusUnauthorized)
			return
		}
		id, err := h.tutorials.CreateLesson(request.CourseID, request.Title, request.MDX)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		err = writeJSON(w, postLessonResponse{
			LessonID: id,
		})
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func (h *handlers) patchLesson() http.HandlerFunc {
	type patchLessonRequest struct {
		LessonID string `json:"lesson_id"`
		Title    string `json:"title"`
		MDX      string `json:"mdx"`
	}
	return func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()
		var request patchLessonRequest
		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		user, err := h.getUser(r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		lesson, err := h.tutorials.GetLesson(request.LessonID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		course, err := h.tutorials.GetCourse(lesson.CourseID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if *user.ID != course.AuthorID {
			http.Error(w, errors.New("unauthorized to update this lesson").Error(), http.StatusUnauthorized)
		}
		err = h.tutorials.UpdateLesson(request.LessonID, request.Title, request.MDX)
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
