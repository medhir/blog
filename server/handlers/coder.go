package handlers

import (
	"fmt"
	"net/http"
)

func (h *handlers) CreateCoderInstance() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id, err := h.coder.AddInstance()
		if err != nil {
			http.Error(w, fmt.Sprintf("Could not create coder instance - %s", err.Error()), http.StatusInternalServerError)
			return
		}
		w.Write([]byte(id))
		w.WriteHeader(http.StatusOK)
	}
}
