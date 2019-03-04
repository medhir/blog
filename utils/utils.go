package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httputil"
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

// Albums returns a HandlerFunc that writes a JSON response with
// a string array of album names
func Albums() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "GET" {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		// get albums from photos
		albums, err := ListAlbums()
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

// Photos returns a HandlerFunc that writes a JSON response containing
// a string array of S3 object keys associated with album
func Photos() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		// Get album param from URL
		album := r.URL.Query().Get("album")
		// Use AWS util method to get photo keys
		photoKeys, err := GetPhotoKeysForAlbum(album)
		if err != nil {
			http.Error(w, "Photo keys could not be retreived", http.StatusInternalServerError)
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

type s3UploadResult struct {
	Location string
	UploadID string
}

// Upload returns a HandlerFunc that uploads a Multipart Form with
// image data as an object in the S3 bucket specified by BucketName
func Upload() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var uploadResults []s3UploadResult
		r.ParseMultipartForm(32 << 20)
		fileHeaders := r.MultipartForm.File["image"]
		for _, fileHeader := range fileHeaders {
			key := fileHeader.Filename
			file, err := fileHeader.Open()
			if err != nil {
				fmt.Println(err.Error())
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			defer file.Close()
			result, err := UploadPhoto(file, "feb.2019", key)
			if err != nil {
				fmt.Println(err.Error())
				http.Error(w, "Could not upload file "+key, http.StatusInternalServerError)
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

// BlogPosts provides a JSON response with the blog's index
func BlogPosts() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		index, err := FetchBlogIndex()
		if err != nil {
			fmt.Println(err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(index)
	})
}
