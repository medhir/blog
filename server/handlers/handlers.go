package handlers

import "github.com/medhir/blog/server/auth"

// Handlers describes application components relied on to serve http requests
type Handlers struct {
	Auth auth.Auth
}
