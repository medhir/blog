package handlers

import (
	"encoding/json"
	"fmt"
	"gitlab.com/medhir/blog/server/controllers/tutorial"
	"net/http"
	"path"
)

const coursesBase = "courses"

// GetCourseResponse describes the fields associated with a GET course request
type GetCourseResponse struct {
	Metadata *tutorial.Course   `json:"metadata"`
	Lessons  []*tutorial.Lesson `json:"lessons"`
}

func (h *handlers) getCourse() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		courseID := path.Base(r.URL.Path)
		user, err := h.getUser(r)
		course, err := h.tutorials.GetCourse(courseID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if *user.ID != course.AuthorID {
			http.Error(w, fmt.Sprintf("insufficient permissions to update course %s", course.ID), http.StatusUnauthorized)
			return
		}
		lessons, err := h.tutorials.GetLessons(courseID)
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

// postCourse handles a POST request to the /courses/ endpoint.
func (h *handlers) postCourse() http.HandlerFunc {
	type postCourseRequest struct {
		Title       string `json:"title"`
		Description string `json:"description"`
	}
	type postCourseResponse struct {
		ID string `json:"id"`
	}
	return func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()
		// read course from the request
		var data postCourseRequest
		err := json.NewDecoder(r.Body).Decode(&data)
		if err != nil {
			http.Error(w, fmt.Sprintf("Unable to decode data in request body - %s", err.Error()), http.StatusInternalServerError)
			return
		}
		// get author's ID and add to course
		user, err := h.getUser(r)
		id, err := h.tutorials.CreateCourse(*user.ID, data.Title, data.Description)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeJSON(w, postCourseResponse{
			ID: id,
		})
		w.WriteHeader(http.StatusOK)
	}
}

func (h *handlers) patchCourse() http.HandlerFunc {
	type patchCourseRequest struct {
		AuthorID    string `json:"author_id"`
		ID          string `json:"id"`
		Title       string `json:"title"`
		Description string `json:"description"`
	}
	return func(w http.ResponseWriter, r *http.Request) {
		// read course from the request
		var request patchCourseRequest
		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			http.Error(w, fmt.Sprintf("Unable to decode data in request body - %s", err.Error()), http.StatusInternalServerError)
			return
		}
		// verify user can update this course
		user, err := h.getUser(r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		course, err := h.tutorials.GetCourse(request.ID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if course.AuthorID != *user.ID {
			http.Error(w, fmt.Sprintf("insufficient permissions to update course %s", course.ID), http.StatusUnauthorized)
			return
		}
		err = h.db.UpdateCourse(request.ID, request.Title, request.Description)
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
		// verify user can delete this course
		user, err := h.getUser(r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		course, err := h.tutorials.GetCourse(courseID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if course.AuthorID != *user.ID {
			http.Error(w, fmt.Sprintf("insufficient permissions to update course %s", course.ID), http.StatusUnauthorized)
			return
		}
		err = h.tutorials.DeleteCourse(courseID)
		if err != nil {
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}
		w.WriteHeader(http.StatusOK)
	}
}

func (h *handlers) HandleCourse() http.HandlerFunc {
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

func (h *handlers) getCourses() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user, err := h.getUser(r)
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
	}
}

func (h *handlers) HandleCourses() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			h.getCourses()(w, r)
		default:
			http.Error(w, fmt.Sprintf("unimplemented method %s", r.Method), http.StatusNotImplemented)
			return
		}
	}
}
