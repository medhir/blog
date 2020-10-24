package handlers

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"gitlab.com/medhir/blog/server/controllers/code"
	"gitlab.com/medhir/blog/server/controllers/tutorial"
	"io"
	"net/http"
	"path"
)

func (h *handlers) getLesson() http.HandlerFunc {
	type getLessonResponse struct {
		Lesson   *tutorial.Lesson `json:"lesson"`
		Instance *code.Instance   `json:"instance"`
	}
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
		err = writeJSON(w, getLessonResponse{
			Lesson:   lesson,
			Instance: instance,
		})
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
		LessonID   string `json:"lesson_id"`
		Title      string `json:"title"`
		MDX        string `json:"mdx"`
		FolderName string `json:"folder_name"`
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
			return
		}
		err = h.tutorials.UpdateLesson(request.LessonID, request.Title, request.MDX, request.FolderName)
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

func (h *handlers) postLessonAsset() http.HandlerFunc {
	type postLessonAssetResponse struct {
		URL string `json:"url"`
	}
	return func(w http.ResponseWriter, r *http.Request) {
		lessonID := path.Base(r.URL.Path)
		// check user has permission to upload asset to this lesson
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
		user, err := h.getUser(r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if *user.ID != course.AuthorID {
			http.Error(w, errors.New("unauthorized to upload asset this lesson").Error(), http.StatusUnauthorized)
			return
		}
		// then upload the asset
		err = r.ParseMultipartForm(32 << 20)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
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
			url, err := h.tutorials.AddLessonAsset(lessonID, processedImage)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			err = writeJSON(w, postLessonAssetResponse{
				URL: url,
			})
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			return
		}
	}
}

func (h *handlers) deleteLessonAsset() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		lessonID := path.Base(r.URL.Path)
		// check user has permission to delete asset from this lesson
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
		user, err := h.getUser(r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if *user.ID != course.AuthorID {
			http.Error(w, errors.New("unauthorized to upload asset this lesson").Error(), http.StatusUnauthorized)
			return
		}
		// then delete the lesson asset
		names, ok := r.URL.Query()["name"]
		if !ok || len(names) < 1 {
			http.Error(w, "name must be provided as a query parameter", http.StatusBadRequest)
			return
		}
		name := names[0]
		err = h.tutorials.DeleteLessonAsset(lessonID, name)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func (h *handlers) HandleLessonAsset() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			h.postLessonAsset()(w, r)
		case http.MethodDelete:
			h.deleteLessonAsset()(w, r)
		default:
			http.Error(w, fmt.Sprintf("unimplemented http handler for method %s", r.Method), http.StatusMethodNotAllowed)
			return
		}
	}
}

func (h *handlers) getLessonAssets() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		lessonID := path.Base(r.URL.Path)
		assets, err := h.tutorials.GetLessonAssets(lessonID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		err = writeJSON(w, assets)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func (h *handlers) HandleLessonAssets() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			h.getLessonAssets()(w, r)
		default:
			http.Error(w, fmt.Sprintf("unimplemented http handler for method %s", r.Method), http.StatusMethodNotAllowed)
			return
		}
	}
}
