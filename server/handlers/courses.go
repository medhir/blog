package handlers

import (
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	"gitlab.com/medhir/blog/server/storage/sql"
	"net/http"
	"path"
)

func (h *handlers) getCourse() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		courseID := path.Base(r.URL.Path)
		if courseID == "" {
			courses, err := h.db.GetCourses()
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			err = writeJSON(w, courses)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		} else {
			course, err := h.db.GetCourse(courseID)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			err = writeJSON(w, course)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}
	}
}

func (h *handlers) postCourse() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()
		// read course from the request
		var course sql.Course
		err := json.NewDecoder(r.Body).Decode(&course)
		if err != nil {
			http.Error(w, fmt.Sprintf("Unable to decode data in request body - %s", err.Error()), http.StatusInternalServerError)
			return
		}
		// add new UUID to course
		course.ID = uuid.New().String()
		id, err := h.db.CreateCourse(course)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Write([]byte(id))
		w.WriteHeader(http.StatusOK)
	}
}

func (h *handlers) patchCourse() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// read course from the request
		var course sql.Course
		err := json.NewDecoder(r.Body).Decode(&course)
		if err != nil {
			http.Error(w, fmt.Sprintf("Unable to decode data in request body - %s", err.Error()), http.StatusInternalServerError)
			return
		}
		err = h.db.UpdateCourse(course)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	}
}

func (h *handlers) deleteCourse() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		courseID := path.Base(r.URL.Path)
		err := h.db.DeleteCourse(courseID)
		if err != nil {
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}
		w.WriteHeader(http.StatusOK)
	}
}

func (h *handlers) HandleCourses() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			h.getCourse()(w, r)
		case http.MethodPost:
			h.postCourse()(w, r)
		case http.MethodPatch:
			h.patchCourse()(w, r)
		case http.MethodDelete:
			h.deleteCourse()(w, r)
		}
	}
}
