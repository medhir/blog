package handlers

import (
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	"gitlab.com/medhir/blog/server/storage/sql"
	"net/http"
	"path"
)

const coursesBase = "courses"

type GetCourseResponse struct {
	Metadata *sql.Course   `json:"metadata"`
	Lessons  []*sql.Lesson `json:"lessons"`
}

func (h *handlers) getCourse() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		courseID := path.Base(r.URL.Path)
		// if no ID is provided, return all courses
		if courseID == coursesBase {
			jwt, err := h.getJWTCookie(r)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
			user, err := h.auth.GetUser(jwt)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
			courses, err := h.db.GetCourses(*user.ID)
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
			lessons, err := h.db.GetLessons(courseID)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			err = writeJSON(w, GetCourseResponse{
				Metadata: course,
				Lessons:  lessons,
			})
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}
	}
}

// postCourse handles a POST request to the /courses/ endpoint.
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
		// get author ID and add to course
		jwt, err := h.getJWTCookie(r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		user, err := h.auth.GetUser(jwt)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		course.AuthorID = *user.ID
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

		// verify user can update this course
		jwt, err := h.getJWTCookie(r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		user, err := h.auth.GetUser(jwt)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		if course.AuthorID != *user.ID {
			http.Error(w, fmt.Sprintf("insufficient permissions to update course %s", course.ID), http.StatusUnauthorized)
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
		course, err := h.db.GetCourse(courseID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

		// verify user can delete this course
		jwt, err := h.getJWTCookie(r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		user, err := h.auth.GetUser(jwt)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		if course.AuthorID != *user.ID {
			http.Error(w, fmt.Sprintf("insufficient permissions to update course %s", course.ID), http.StatusUnauthorized)
			return
		}

		err = h.db.DeleteCourse(courseID)
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
		default:
			http.Error(w, fmt.Sprintf("unimplemented method %s", r.Method), http.StatusNotImplemented)
			return
		}
	}
}
