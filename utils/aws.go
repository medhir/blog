package utils

import (
	"fmt"
	"os"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

func exitErrorf(msg string, args ...interface{}) {
	fmt.Fprintf(os.Stderr, msg+"\n", args...)
	os.Exit(1)
}

const BUCKET_NAME = "medhir-blog-dev"
const ALBUM_PREFIX = "albums/"

var sess = session.Must(session.NewSession(&aws.Config{Region: aws.String("us-west-2")}))
var svc = s3.New(sess)

// List all buckets for AWS account
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

// Return array of folder names under ALBUM_PREFIX in s3 bucket
func ListAlbums() ([]string, error) {
	resp, err := svc.ListObjects(&s3.ListObjectsInput{
		Bucket:    aws.String(BUCKET_NAME),
		Prefix:    aws.String(ALBUM_PREFIX),
		Delimiter: aws.String("/")})
	var albums []string
	prefixedAlbums := resp.CommonPrefixes
	for _, prefixedAlbum := range prefixedAlbums {
		p := aws.StringValue(prefixedAlbum.Prefix)
		a := strings.TrimPrefix(p, ALBUM_PREFIX)
		a = strings.TrimSuffix(a, "/")
		albums = append(albums, a)
	}
	return albums, err
}

// Return all photo object keys for album in s3 "folder"
func GetPhotoKeysForAlbum(album string) ([]string, error) {
	resp, err := svc.ListObjects(&s3.ListObjectsInput{
		Bucket: aws.String(BUCKET_NAME),
		Prefix: aws.String(ALBUM_PREFIX + album + "/")})
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
