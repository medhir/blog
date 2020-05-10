package handlers

import (
	"fmt"
	"net/http"
	"path"
)

func (h *handlers) createCoderInstance() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		instance, err := h.coder.AddInstance()
		if err != nil {
			http.Error(w, fmt.Sprintf("Could not create coder instance - %s", err.Error()), http.StatusInternalServerError)
			return
		}
		writeJSON(w, instance)
		w.WriteHeader(http.StatusOK)
	}
}

func (h *handlers) removeCoderInstance() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := path.Base(r.URL.Path)
		err := h.coder.RemoveInstance(id)
		if err != nil {
			http.Error(w, fmt.Sprintf("Could not delete coder instance - %s", err.Error()), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	}
}

func (h *handlers) HandleCoder() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			h.createCoderInstance()(w, r)
		case http.MethodDelete:
			h.removeCoderInstance()(w, r)
		default:
			http.Error(w, fmt.Sprintf("unimplemented http handler for method %s", r.Method), http.StatusMethodNotAllowed)
			return
		}
	}
}
