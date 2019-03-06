package api

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"strings"

	"github.com/aws/aws-sdk-go/service/s3/s3manager"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

func exitErrorf(msg string, args ...interface{}) {
	fmt.Fprintf(os.Stderr, msg+"\n", args...)
	os.Exit(1)
}

func getBytesFromStream(stream io.Reader) []byte {
	buf := new(bytes.Buffer)
	buf.ReadFrom(stream)
	return buf.Bytes()
}

// BucketName is the name of S3 Bucket for application operations
const BucketName = "medhir-blog-dev"

// BlogPosts is the folder prefix for blog posts
const BlogPosts = "blog/posts/"

// BlogDrafts is the folder prefix for blog drafts
const BlogDrafts = "blog/drafts/"

// AlbumPrefix is the string value associated with the S3 albums "Folder"
const AlbumPrefix = "albums/"

const postIndex = "blog/posts/index"
const draftIndex = "blog/drafts/index"

var sess = session.Must(session.NewSession(&aws.Config{Region: aws.String("us-west-2")}))
var svc = s3.New(sess)
var uploader = s3manager.NewUploaderWithClient(svc)
var downloader = s3manager.NewDownloaderWithClient(svc)

// getAlbums returns a slice of folder names under AlbumPrefix in s3 bucket
func getAlbums() ([]string, error) {
	resp, err := svc.ListObjects(&s3.ListObjectsInput{
		Bucket:    aws.String(BucketName),
		Prefix:    aws.String(AlbumPrefix),
		Delimiter: aws.String("/")})
	var albums []string
	prefixedAlbums := resp.CommonPrefixes
	for _, prefixedAlbum := range prefixedAlbums {
		p := aws.StringValue(prefixedAlbum.Prefix)
		a := strings.TrimPrefix(p, AlbumPrefix)
		a = strings.TrimSuffix(a, "/")
		albums = append(albums, a)
	}
	return albums, err
}

// getPhotoKeysForAlbum returns all photo object keys for album in s3 "folder"
func getPhotoKeysForAlbum(album string) ([]string, error) {
	resp, err := svc.ListObjects(&s3.ListObjectsInput{
		Bucket: aws.String(BucketName),
		Prefix: aws.String(AlbumPrefix + album + "/")})
	var photoKeys []string
	for _, obj := range resp.Contents {
		key := aws.StringValue(obj.Key)
		// Exclude "Folder" objects from response
		if key[len(key)-1:] != "/" {
			photoKeys = append(photoKeys, key)
		}
	}
	return photoKeys, err
}

// uploadPhotoToS3 uploads a photo as an S3 object under a specific album s3 "folder"
func uploadPhotoToS3(file multipart.File, album string, key string) (*s3manager.UploadOutput, error) {
	uploadParams := &s3manager.UploadInput{
		Bucket: aws.String(BucketName),
		Key:    aws.String(AlbumPrefix + album + "/" + key),
		Body:   file,
		ACL:    aws.String("public-read")}
	result, err := uploader.Upload(uploadParams)
	return result, err
}

const blogIndexKey = "blog/index.json"

// getBytesForObject returns a byte slice containing contents of object at key
func getBytesForObject(key string) ([]byte, error) {
	buffer := aws.NewWriteAtBuffer([]byte{})
	_, err := downloader.Download(buffer, &s3.GetObjectInput{
		Bucket: aws.String(BucketName),
		Key:    aws.String(key)})
	return buffer.Bytes(), err
}

// putJSON writes a .json file with key as the file name
func putJSON(body io.Reader, key string) (*s3manager.UploadOutput, error) {
	uploadParams := &s3manager.UploadInput{
		Bucket: aws.String(BucketName),
		Key:    aws.String(key + ".json"),
		Body:   body,
		ACL:    aws.String("public-read")}
	result, err := uploader.Upload(uploadParams)
	return result, err
}

// BlogPostEntry describes the json encoding for a blog post
type BlogPostEntry struct {
	Title     string `json:"title"`
	Published int64  `json:"published"`
	ID        string `json:"id"`
}

func getBlogIndex() ([]byte, error) {
	index, err := getBytesForObject(postIndex + ".json")
	return index, err
}

func getDraftIndex() ([]byte, error) {
	index, err := getBytesForObject(draftIndex + ".json")
	return index, err
}

// updateBlogIndex writes an updated json file of all blog posts
func updateBlogIndex(post []byte) error {
	entry := BlogPostEntry{}
	err := json.Unmarshal(post, &entry)
	if err != nil {
		return err
	}
	var index []BlogPostEntry
	indexBytes, err := getBlogIndex()
	if err != nil {
		return err
	}
	err = json.Unmarshal(indexBytes, &index)
	if err != nil {
		return err
	}
	index = append(index, entry)
	newJSON, err := json.Marshal(index)
	if err != nil {
		return err
	}
	_, err = putJSON(bytes.NewReader(newJSON), postIndex)
	if err != nil {
		return err
	}
	return nil
}

// BlogDraftEntry is the JSON data sent by the client to save a draft
type BlogDraftEntry struct {
	ID       string  `json:"id"`
	Markdown string  `json:"markdown"`
	Saved    float64 `json:"saved"`
	Title    string  `json:"title"`
}

func updateDraftIndex(body []byte) error {
	entry := BlogDraftEntry{}
	err := json.Unmarshal(body, &entry)
	if err != nil {
		return errors.New("Failed to construct draft. Method error - " + err.Error())
	}
	var index []BlogDraftEntry
	indexBytes, err := getDraftIndex()
	if err != nil {
		return errors.New("Failed to get draft index from S3")
	}
	fmt.Println(string(indexBytes))
	err = json.Unmarshal(indexBytes, &index)
	if err != nil {
		return errors.New("Failed to construct index. Method error - " + err.Error())
	}
	index = append(index, entry)
	newJSON, err := json.Marshal(index)
	if err != nil {
		return errors.New("Failed to create json response buffer")
	}
	_, err = putJSON(bytes.NewReader(newJSON), draftIndex)
	if err != nil {
		return errors.New("Failed to put updated draft index")
	}
	return nil
}
