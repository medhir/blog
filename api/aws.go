package api

import (
	"bytes"
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

// AlbumPrefix is the string value associated with the S3 albums "Folder"
const AlbumPrefix = "albums/"

var sess = session.Must(session.NewSession(&aws.Config{
	Region:     aws.String("us-west-2"),
	HTTPClient: httpClient,
}))
var svc = s3.New(sess)
var uploader = s3manager.NewUploaderWithClient(svc)
var downloader = s3manager.NewDownloaderWithClient(svc)

func getKeys(prefix string) ([]string, error) {
	resp, err := svc.ListObjects(&s3.ListObjectsInput{
		Bucket:    aws.String(BucketName),
		Prefix:    aws.String(prefix),
		Delimiter: aws.String("/")})

	var keys []string
	for _, obj := range resp.Contents {
		key := aws.StringValue(obj.Key)
		// Exclude "Folder" objects from response
		if key[len(key)-1:] != "/" {
			keys = append(keys, key)
		}
	}
	return keys, err
}

// getKeysByMostRecent returns an array of object keys in order of most recent to least recent
func getKeysByMostRecent(prefix string) ([]string, error) {
	date := func(o1, o2 *s3.Object) bool {
		return o1.LastModified.After(*o2.LastModified)
	}
	resp, err := svc.ListObjects(&s3.ListObjectsInput{
		Bucket:    aws.String(BucketName),
		Prefix:    aws.String(prefix),
		Delimiter: aws.String("/")})
	objects := resp.Contents
	By(date).Sort(objects)
	var keys []string
	for _, obj := range resp.Contents {
		key := aws.StringValue(obj.Key)
		// Exclude "Folder" objects from response
		if key[len(key)-1:] != "/" {
			keys = append(keys, key)
		}
	}
	return keys, err
}

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
	prefix := AlbumPrefix + album + "/"
	keys, err := getKeysByMostRecent(prefix)
	return keys, err
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

// putObject writes a file with key as the file name
func putObject(body io.Reader, key string) (*s3manager.UploadOutput, error) {
	uploadParams := &s3manager.UploadInput{
		Bucket: aws.String(BucketName),
		Key:    aws.String(key),
		Body:   body,
		ACL:    aws.String("public-read")}
	result, err := uploader.Upload(uploadParams)
	return result, err
}

func deleteObject(key string) (*s3.DeleteObjectOutput, error) {
	deleteParams := &s3.DeleteObjectInput{
		Bucket: aws.String(BucketName),
		Key:    aws.String(key)}
	result, err := svc.DeleteObject(deleteParams)
	return result, err
}
