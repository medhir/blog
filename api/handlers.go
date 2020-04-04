package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"net/http/httputil"
	"path"

	"github.com/google/uuid"
	"github.com/medhir/blog/server/imageprocessor"
)

// Album semantially represents the name of an album storing photos in S3
type Album struct {
	Name string
}

func dumpRequest(r *http.Request) {
	output, err := httputil.DumpRequest(r, true)
	if err != nil {
		fmt.Println("Error dumping request", err)
	}
	fmt.Println(string(output))
}

// GetAlbums returns a HandlerFunc that writes a JSON response with
// a string array of album names
func GetAlbums() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "GET" {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		// get albums from photos
		albums, err := getAlbums()
		if err != nil {
			http.Error(w, "Could not get objects at s3 bucket "+BucketName, http.StatusInternalServerError)
			return
		}

		// write JSON to response
		w.Header().Set("Content-Type", "application/json")
		obj, err := json.Marshal(albums)
		if err != nil {
			http.Error(w, "Data could not be encoded.", http.StatusInternalServerError)
		}
		w.WriteHeader(http.StatusOK)
		w.Write(obj)
	})
}

// GetPhotos returns a HandlerFunc that writes a JSON response containing
// a string array of S3 object keys associated with album
func GetPhotos() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		// Get album param from URL
		album := r.URL.Query().Get("album")
		// Use AWS util method to get photo keys
		photoKeys, err := getPhotoKeysForAlbum(album)
		if err != nil {
			http.Error(w, fmt.Sprintf("Photo keys could not be retreived: %v", err.Error()), http.StatusInternalServerError)
			return
		}
		// Write response as JSON
		w.Header().Set("Content-Type", "application/json")
		obj, err := json.Marshal(photoKeys)
		if err != nil {
			http.Error(w, "Data could not be encoded.", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write(obj)
	})
}

// DeletePhoto handles deletion of a photo from s3
func DeletePhoto() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodDelete {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		id := r.URL.Query().Get("id")
		photoKey := "albums/main/" + id + ".jpg"
		result, err := deleteObject(photoKey)
		if err != nil {
			http.Error(w, "Object could not be deleted - "+err.Error(), http.StatusInternalServerError)
			return
		}
		resultJSON, _ := json.Marshal(result)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(resultJSON)
	})
}

type s3UploadResult struct {
	Location string
	UploadID string
}

// UploadPhoto returns a HandlerFunc that uploads a Multipart Form with
// image data as a jpg image in the S3 bucket specified by BucketName
// 		prefix string specifies the string prefix for the S3 Object key.
func UploadPhoto(prefix string) http.HandlerFunc {
	imageprocessor := imageprocessor.NewImageProcessor(int64(25))
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var uploadResults []s3UploadResult
		r.ParseMultipartForm(32 << 20)
		fileHeaders := r.MultipartForm.File["image"]
		for _, fileHeader := range fileHeaders {
			id := uuid.New().String()
			file, err := fileHeader.Open()
			if err != nil {
				fmt.Println(err.Error())
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			defer file.Close()
			fileBuffer := bytes.NewBuffer(nil)
			_, err = io.Copy(fileBuffer, file)
			if err != nil {
				fmt.Println(err.Error())
				http.Error(w, "Could not create buffer for file", http.StatusInternalServerError)
				return
			}
			// processedImage := reduceFileSizeAndConvertToJPG(fileBuffer.Bytes())
			processedImage, err := imageprocessor.ProcessImage(fileBuffer.Bytes())
			if err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}
			result, err := putObject(bytes.NewReader(processedImage), prefix+id+".jpg")
			if err != nil {
				fmt.Println(err.Error())
				http.Error(w, "Could not upload file "+id+".jpg", http.StatusInternalServerError)
				return
			}
			uploadResult := s3UploadResult{
				Location: result.Location,
				UploadID: result.UploadID}
			uploadResults = append(uploadResults, uploadResult)
		}
		w.Header().Set("Content-Type", "application/json")
		obj, err := json.Marshal(uploadResults)
		if err != nil {
			fmt.Println(err.Error())
			http.Error(w, "Data could not be encoded.", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write(obj)
	})
}

// BlogPostsAndDrafts describes the JSON response sent to the client for GetBlogPosts()
type BlogPostsAndDrafts struct {
	Posts  []BlogPostEntry  `json:"posts"`
	Drafts []BlogDraftEntry `json:"drafts"`
}

// GetBlogPosts provides a JSON response with the blog's index
func GetBlogPosts() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		blogIndex, err := getBlogIndex()
		if err != nil {
			fmt.Println(err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		var blogPosts []BlogPostEntry
		err = json.Unmarshal(blogIndex, &blogPosts)
		if err != nil {
			fmt.Println(err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		draftIndex, err := getDraftIndex()
		if err != nil {
			fmt.Println(err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		var blogDrafts []BlogDraftEntry
		err = json.Unmarshal(draftIndex, &blogDrafts)
		if err != nil {
			fmt.Println(err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		blogPostAndDraftIndex, err := json.Marshal(BlogPostsAndDrafts{blogPosts, blogDrafts})
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(blogPostAndDraftIndex)
	})
}

// PutBlogPost saves an object with its title as the key under the "blog/posts/" folder
func PutBlogPost() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// get title
		title := path.Base(r.URL.Path)
		fmt.Println(title)
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			fmt.Println(err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		response, err := putObject(bytes.NewReader(body), BlogPosts+title+".json")
		if err != nil {
			fmt.Println(err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		obj, _ := json.Marshal(response)
		err = updateBlogIndex()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(obj)
	})
}

// PutBlogDraft saves an object as json with its id as the filename under the "blog/drafts/" folder
func PutBlogDraft() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id := path.Base(r.URL.Path)
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			fmt.Println(err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		response, err := putObject(bytes.NewReader(body), BlogDrafts+id+".json")
		if err != nil {
			fmt.Println(err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		obj, _ := json.Marshal(response)
		err = updateDraftIndex()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(obj)
	})
}

// GetBlogPost gets an object with under the `blog/posts` folder and returns it as json
func GetBlogPost() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// get title
		title := path.Base(r.URL.Path)
		fmt.Println(title)
		// get bytes for post
		postBytes, err := getBytesForObject(BlogPosts + title + ".json")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(postBytes)
	})
}

// GetBlogDraft gets an object with under the `blog/drafts` folder and returns it as json
func GetBlogDraft() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// get id parameter
		id := path.Base(r.URL.Path)
		// get bytes for draft
		draftBytes, err := getBytesForObject(BlogDrafts + id + ".json")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(draftBytes)
	})
}

// DeleteBlogDraft deletes a blog post draft
func DeleteBlogDraft() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// if r.Method != http.MethodDelete {
		// 	http.Error(w, "Invalid request", http.StatusBadRequest)
		// 	return
		// }
		id := path.Base(r.URL.Path)
		draftKey := BlogDrafts + id + ".json"
		result, err := deleteObject(draftKey)
		if err != nil {
			http.Error(w, "Object could not be deleted - "+err.Error(), http.StatusInternalServerError)
			return
		}
		_ = updateDraftIndex()
		resultJSON, _ := json.Marshal(result)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(resultJSON)
	})
}

// HandleBlogPost handles the requests associated with the blog post API
func HandleBlogPost() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			handleGetBlogPost := GetBlogPost()
			handleGetBlogPost(w, r)
		case http.MethodPost:
			handlePostBlogPost := Authorize(PutBlogPost())
			handlePostBlogPost(w, r)
		}
	})
}

// HandleBlogDraft handles the requests associated with the blog draft API
func HandleBlogDraft() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			handleGetBlogDraft := Authorize(GetBlogDraft())
			handleGetBlogDraft(w, r)
		case http.MethodPost:
		case http.MethodPut:
			handlePostBlogDraft := Authorize(PutBlogDraft())
			handlePostBlogDraft(w, r)
		case http.MethodDelete:
			handleDeleteBlogDraft := Authorize(DeleteBlogDraft())
			handleDeleteBlogDraft(w, r)
		default:
			w.WriteHeader(http.StatusBadRequest)
		}
	})
}

// HandleBlogAssetUpload handles the requests associated with the blog draft API
func HandleBlogAssetUpload() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id := path.Base(r.URL.Path)
		switch r.Method {
		case http.MethodPost:
			handleImageUpload := Authorize(UploadPhoto("blog/assets/" + id + "/"))
			handleImageUpload(w, r)
		default:
			w.WriteHeader(http.StatusBadRequest)
		}
	})
}
