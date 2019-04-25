package api

import (
	"encoding/json"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path"

	"gopkg.in/russross/blackfriday.v2"
)

type BlogPost struct {
	CSSPath string
	Title   string
	Body    template.HTML
}

var blogTemplateFiles = []string{"templates/main.html", "templates/header.html", "templates/footer.html", "templates/blogPost.html"}
var notFoundFiles = []string{"templates/main.html", "templates/header.html", "templates/footer.html", "templates/notFound.html"}
var (
	blogTemplates     = template.Must(template.ParseFiles(blogTemplateFiles...))
	notFoundTemplates = template.Must(template.ParseFiles(notFoundFiles...))
)
var cssPath string

type cssManifest struct {
	CSSPath string `json:"main.css"`
}

func getCSSPath() {
	manifestJSON, err := os.Open("build/asset-manifest.json")
	if err != nil {
		log.Println("Could not open asset-manifest.json")
	}
	defer manifestJSON.Close()
	manifestBytes, _ := ioutil.ReadAll(manifestJSON)
	var manifest cssManifest
	json.Unmarshal(manifestBytes, &manifest)
	cssPath = manifest.CSSPath
}

func GetPost() http.HandlerFunc {
	if cssPath == "" {
		getCSSPath()
	}
	log.Println(cssPath)
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "GET" {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		base := path.Base(r.URL.Path)
		postBytes, err := getBytesForObject(BlogPosts + base + ".json")
		if err != nil {
			data := BlogPost{
				Title:   "I Do Not Exist!",
				CSSPath: cssPath}
			notFoundTemplates.ExecuteTemplate(w, "main", data)
			return
		}
		post := BlogPostEntry{}
		err = json.Unmarshal(postBytes, &post)
		if err != nil {
			http.Error(w, "Failed to unmarshal JSON", http.StatusInternalServerError)
			return
		}
		data := BlogPost{
			Title:   post.Title,
			CSSPath: cssPath,
			Body:    template.HTML(blackfriday.Run([]byte(post.Markdown)))}
		blogTemplates.ExecuteTemplate(w, "main", data)
	})
}
