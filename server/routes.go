package api

const (
	homePath = "/"
	blogPath = "/blog"
)

func (api *api) routes() {
	api.Router.HandleFunc(homePath, HandleFunc)
	api.Router.HandleFunc("")
}
