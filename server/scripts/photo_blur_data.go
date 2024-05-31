package main

import (
	"bytes"
	"cloud.google.com/go/storage"
	"context"
	"encoding/base64"
	"fmt"
	"github.com/disintegration/imaging"
	"google.golang.org/api/iterator"
	"image"
	"image/jpeg"
)

func main() {
	ctx := context.Background()
	bucketName := "medhir-com" // replace with your bucket name

	client, err := storage.NewClient(ctx)
	if err != nil {
		fmt.Println("Failed to create GCS client:", err)
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

		// Resize and blur the image
		resized := imaging.Resize(img, 10, 10, imaging.Lanczos)
		blurred := imaging.Blur(resized, 1.0)

		// Encode the blurred image to JPEG
		buf := new(bytes.Buffer)
		if err := jpeg.Encode(buf, blurred, nil); err != nil {
			fmt.Println("Failed to encode image:", err)
			return
		}

		// Convert the JPEG bytes to a base64 string
		base64Str := base64.StdEncoding.EncodeToString(buf.Bytes())

		// Create the data URL
		blurDataURL := "data:image/jpeg;base64," + base64Str

		object := bucket.Object(attrs.Name)
		objectAttrsToUpdate := storage.ObjectAttrsToUpdate{
			Metadata: map[string]string{
				"blurDataURL": blurDataURL,
			},
		}
		if _, err := object.Update(ctx, objectAttrsToUpdate); err != nil {
			fmt.Println("Failed to update object metadata:", err)
			return
		}
		fmt.Printf("Updated metadata for object %s with blurDataURL: %s\n", attrs.Name, blurDataURL)
	}
}
