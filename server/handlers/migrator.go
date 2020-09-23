package handlers

import "net/http"

func (h *handlers) MigrateUp() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := h.db.MigrateUp()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	}
}

func (h *handlers) MigrateDown() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := h.db.MigrateDown()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	}
}
