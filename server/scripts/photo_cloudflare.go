package main

import (
	"cloud.google.com/go/storage"
	"context"
	"fmt"
	"github.com/cloudflare/cloudflare-go"
	"google.golang.org/api/iterator"
)

func main() {
	ctx := context.Background()
	bucketName := "medhir-com" // replace with your bucket name

	// replace with your Cloudflare API credentials
	api, err := cloudflare.New("api_key", "email")
	if err != nil {
		fmt.Println("Failed to create Cloudflare client:", err)
		return
	}

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
		// upload the data to Cloudflare
		imgUpload, err := api.UploadImage(ctx, cloudflare.AccountIdentifier("b5ac6ecbf3f720fdccea6c9ad891a10c"), cloudflare.UploadImageParams{
			File: rc,
		})

		if err != nil {
			fmt.Println("Failed to upload image to Cloudflare:", err)
			return
		}
		fmt.Printf("Uploaded object %s to Cloudflare\n%v", attrs.Name, imgUpload)
		rc.Close()

		object := bucket.Object(attrs.Name)
		objectAttrsToUpdate := storage.ObjectAttrsToUpdate{
			Metadata: map[string]string{
				"cdnURL": imgUpload.Variants[0],
			},
		}
		if _, err := object.Update(ctx, objectAttrsToUpdate); err != nil {
			fmt.Println("Failed to update object metadata:", err)
			return
		}
		fmt.Printf("Updated metadata for object %s with cdnURL: %s\n", attrs.Name, imgUpload.Variants[0])
	}
}
