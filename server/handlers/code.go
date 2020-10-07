package handlers

import (
	"fmt"
	"net/http"
)

func (h *handlers) removeCodeInstance() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user, err := h.getUser(r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		err = h.code.RemoveInstance(user)
		if err != nil {
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
		}
	}
}

func (h *handlers) HandleCodeInstance() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodDelete:
			h.removeCodeInstance()(w, r)
		default:
			http.Error(w, fmt.Sprintf("unimplemented method %s", r.Method), http.StatusNotImplemented)
			return
		}
	}
}
