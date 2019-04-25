package api

import (
	"encoding/json"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path"
	"time"

	"gopkg.in/russross/blackfriday.v2"
)

type BlogPost struct {
	CSSPath string
	Title   string
	Body    template.HTML
}

type blogIndexEntry struct {
	Title         string `json:"title"`
	TitlePath     string `json:"titlePath"`
	PublishedDate string `json:"publishedDate"`
}

type BlogIndex struct {
	CSSPath string
	Title   string
	Posts   []blogIndexEntry
}

var blogIndexTemplateFiles = []string{"templates/main.html", "templates/header.html", "templates/footer.html", "templates/blogIndex.html"}
var blogPostTemplateFiles = []string{"templates/main.html", "templates/header.html", "templates/footer.html", "templates/blogPost.html"}
var notFoundFiles = []string{"templates/main.html", "templates/header.html", "templates/footer.html", "templates/notFound.html"}
var (
	blogIndexTemplates = template.Must(template.ParseFiles(blogIndexTemplateFiles...))
	blogPostTemplates  = template.Must(template.ParseFiles(blogPostTemplateFiles...))
	notFoundTemplates  = template.Must(template.ParseFiles(notFoundFiles...))
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
		blogPostTemplates.ExecuteTemplate(w, "main", data)
	})
}

func msToTime(ms float64) (time.Time, error) {
	return time.Unix(0, int64(ms)*int64(time.Millisecond)), nil
}

func GetIndex() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "GET" {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		indexBytes, err := getBlogIndex()
		if err != nil {
			http.Error(w, "Could not get index", http.StatusInternalServerError)
			return
		}

		var index []blogPostIndexEntry
		json.Unmarshal(indexBytes, &index)

		var indexView []blogIndexEntry
		for _, entry := range index {
			published, err := msToTime(entry.Published)
			dateString := published.Format("Jan 2, 2006")
			log.Println(dateString)
			if err != nil {
				log.Println(err)
			}
			indexViewEntry := blogIndexEntry{
				Title:         entry.Title,
				TitlePath:     entry.TitlePath,
				PublishedDate: dateString}
			indexView = append(indexView, indexViewEntry)
		}

		viewData := BlogIndex{
			Title:   "medhir.blog",
			CSSPath: cssPath,
			Posts:   indexView}
		blogIndexTemplates.ExecuteTemplate(w, "main", viewData)
	})
}
