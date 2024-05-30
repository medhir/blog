package main

// Adds width and height to gcs object metadata for objects stored in medhir-com/photos/

import (
	"cloud.google.com/go/storage"
	"context"
	"fmt"
	"google.golang.org/api/iterator"
	"image"
	_ "image/jpeg"
	_ "image/png"
)

func main() {
	ctx := context.Background()
	bucketName := "medhir-com" // replace with your bucket name

	client, err := storage.NewClient(ctx)
	if err != nil {
		fmt.Println("Failed to create client:", err)
		return
	}

	bucket := client.Bucket(bucketName)
	it := bucket.Objects(ctx, &storage.Query{
		Prefix:    "photos/",
		Delimiter: "/",
	})

	for {
		attrs, err := it.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			fmt.Println("Failed to list objects:", err)
			return
		}

		rc, err := bucket.Object(attrs.Name).NewReader(ctx)
		if err != nil {
			fmt.Println("Failed to read object:", err)
			return
		}

		img, _, err := image.Decode(rc)
		if err != nil {
			fmt.Println("Failed to decode image:", err)
			rc.Close()
			return
		}
		rc.Close()

		width := img.Bounds().Dx()
		height := img.Bounds().Dy()
		fmt.Printf("Metadata for photo %s with width %d and height %d\n", attrs.Name, width, height)
		object := bucket.Object(attrs.Name)
		objectAttrsToUpdate := storage.ObjectAttrsToUpdate{
			Metadata: map[string]string{
				"width":  fmt.Sprintf("%d", width),
				"height": fmt.Sprintf("%d", height),
			},
		}

		if _, err := object.Update(ctx, objectAttrsToUpdate); err != nil {
			fmt.Println("Failed to update object metadata:", err)
			return
		}
		fmt.Printf("Updated metadata for object %s with width %d and height %d\n", attrs.Name, width, height)
	}
}
