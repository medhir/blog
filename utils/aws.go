package utils

import (
	"fmt"
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

// BucketName is the name of S3 Bucket for application operations
const BucketName = "medhir-blog-dev"

// AlbumPrefix is the string value associated with the S3 albums "Folder"
const AlbumPrefix = "albums/"

var sess = session.Must(session.NewSession(&aws.Config{Region: aws.String("us-west-2")}))
var svc = s3.New(sess)
var uploader = s3manager.NewUploaderWithClient(svc)
var downloader = s3manager.NewDownloaderWithClient(svc)

// ListBuckets list all buckets for AWS account
func ListBuckets() {
	result, err := svc.ListBuckets(nil)
	if err != nil {
		exitErrorf("Unable to list buckets, %v", err)
	}
	fmt.Println("Buckets:")

	for _, b := range result.Buckets {
		fmt.Printf("* %s created on %s\n", aws.StringValue(b.Name), aws.TimeValue(b.CreationDate))
	}
}

// ListAlbums returns a slice of folder names under AlbumPrefix in s3 bucket
func ListAlbums() ([]string, error) {
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

// GetPhotoKeysForAlbum returns all photo object keys for album in s3 "folder"
func GetPhotoKeysForAlbum(album string) ([]string, error) {
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

// UploadPhoto uploads a photo as an S3 object under a specific album s3 "folder"
func UploadPhoto(file multipart.File, album string, key string) (*s3manager.UploadOutput, error) {
	uploadParams := &s3manager.UploadInput{
		Bucket: aws.String(BucketName),
		Key:    aws.String(AlbumPrefix + album + "/" + key),
		Body:   file,
		ACL:    aws.String("public-read")}
	result, err := uploader.Upload(uploadParams)
	return result, err
}

const blogIndexKey = "blog/index.json"

// FetchBlogIndex returns a byte slice containing contents of medhir-blog-dev/blog/index.json
func FetchBlogIndex() ([]byte, error) {
	buffer := aws.NewWriteAtBuffer([]byte{})
	_, err := downloader.Download(buffer, &s3.GetObjectInput{
		Bucket: aws.String(BucketName),
		Key:    aws.String(blogIndexKey)})
	return buffer.Bytes(), err
}
