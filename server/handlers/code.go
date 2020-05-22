package handlers

import (
	"fmt"
	"net/http"
)

func (h *handlers) HandleCodeInstance() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			h.createCodeInstance()(w, r)
		case http.MethodDelete:
			h.removeCodeInstance()(w, r)
		default:
			http.Error(w, fmt.Sprintf("unimplemented http handler for method %s", r.Method), http.StatusMethodNotAllowed)
			return
		}
	}
}

func (h *handlers) HandleCodeDeployment() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			h.createCodeDeployment()(w, r)
		case http.MethodDelete:
			h.removeCodeDeployment()(w, r)
		default:
			http.Error(w, fmt.Sprintf("unimplemented http handler for method %s", r.Method), http.StatusMethodNotAllowed)
			return
		}
	}
}

func (h *handlers) createCodeInstance() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		jwt, err := h.getJWTCookie(r)
		if err != nil {
			http.Error(w, "could not read authorization cookie", http.StatusInternalServerError)
		}
		instance, err := h.coder.AddInstance(jwt)
		if err != nil {
			http.Error(w, fmt.Sprintf("error creating coder instance - %s", err.Error()), http.StatusInternalServerError)
			return
		}
		writeJSON(w, instance)
		w.WriteHeader(http.StatusOK)
	}
}

func (h *handlers) removeCodeInstance() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		jwt, err := h.getJWTCookie(r)
		if err != nil {
			http.Error(w, "could not read authorization cookie", http.StatusInternalServerError)
			return
		}
		err = h.coder.RemoveInstance(jwt)
		if err != nil {
			http.Error(w, fmt.Sprintf("error deleting coder instance - %s", err.Error()), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	}
}

func (h *handlers) createCodeDeployment() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		jwt, err := h.getJWTCookie(r)
		if err != nil {
			http.Error(w, "could not read authorization cookie", http.StatusInternalServerError)
			return
		}
		exists, err := h.coder.HasInstance(jwt)
		if err != nil {
			http.Error(w, "unable to determine if instance exists", http.StatusInternalServerError)
			return
		}
		if !exists {
			_, err = h.coder.AddInstance(jwt)
			if err != nil {
				http.Error(w, fmt.Sprintf("Unable to add instance for user - %s", err.Error()), http.StatusInternalServerError)
				return
			}
		}
		instance, err := h.coder.StartInstance(jwt)
		if err != nil {
			http.Error(w, fmt.Sprintf("unable to start code instance - %s", err.Error()), http.StatusInternalServerError)
			return
		}
		err = writeJSON(w, instance)
		if err != nil {
			http.Error(w, fmt.Sprintf("unable to encode data as JSON - %s", err.Error()), http.StatusInternalServerError)
			return
		}
	}
}

func (h *handlers) removeCodeDeployment() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		jwt, err := h.getJWTCookie(r)
		if err != nil {
			http.Error(w, "could not read authorization cookie", http.StatusInternalServerError)
			return
		}
		err = h.coder.StopInstance(jwt)
		if err != nil {
			http.Error(w, fmt.Sprintf("unable to stop code instance - %s", err.Error()), http.StatusInternalServerError)
			return
		}
	}
}
