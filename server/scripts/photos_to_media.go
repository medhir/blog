package main

import (
	"context"
	"fmt"
	uuid2 "github.com/google/uuid"
	gcs2 "github.com/medhir/blog/server/controllers/storage/gcs"
)

const prodBucketName = "medhir-com"
const reviewBucketName = "medhir-com-review"
const photosPrefix = "photos/"
const mediaPrefix = "media/"

func main() {
	ctx := context.Background()
	gcs, err := gcs2.NewGCS(ctx, prodBucketName)
	if err != nil {
		fmt.Println("cannot create gcs client,", err.Error())
		return
	}
	photos, err := gcs.ListObjects(prodBucketName, photosPrefix)
	if err != nil {
		fmt.Println("cannot get photos,", err.Error())
		return
	}
	photos.Sort(gcs2.ByDateAscending)
	for _, photo := range photos {
		fmt.Printf("photo %s: created at %s\n", photo.Name, photo.Created)
		fmt.Printf("copying photo %s to media\n", photo.Name)
		data, err := gcs.GetObject(photo.Name, prodBucketName)
		if err != nil {
			fmt.Printf("cannot get object for %s: %s\n", photo.Name, err.Error())
			return
		}
		fmt.Printf("received data for %s\n", photo.Name)
		uuid := uuid2.New().String()
		mediaObjectName := fmt.Sprintf("%s%s", mediaPrefix, uuid)
		err = gcs.UploadObject(mediaObjectName, reviewBucketName, data, true)
		if err != nil {
			fmt.Printf("cannot upload object %s: %s\n", mediaObjectName, err.Error())
			return
		}
		fmt.Printf("uploaded object %s\n", mediaObjectName)
		metadata := photo.Metadata
		metadata["type"] = "photo"
		fmt.Printf("updatimg metadata map to: %+v\n", metadata)
		err = gcs.AddObjectMetadata(mediaObjectName, reviewBucketName, metadata)
		if err != nil {
			fmt.Printf("cannot update metadata for object %s: %s\n", mediaObjectName, err.Error())
			return
		}
	}
}
