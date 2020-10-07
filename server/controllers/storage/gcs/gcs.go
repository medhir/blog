package gcs

import (
	"cloud.google.com/go/storage"
	"context"
)

// GCS describes the interface for interacting with the GCS client
type GCS interface {
	CreateBucket(name string) error

	GetObject(name, bucket string) ([]byte, error)
	GetObjectMetadata(name, bucket string) (*storage.ObjectAttrs, error)
	UploadObject(name, bucket string, obj []byte, public bool) error
	DeleteObject(name, bucket string) error
	ListObjects(bucket, prefix string) (Objects, error)
}

const projectID = "blog-121419"

type gcs struct {
	ctx    context.Context
	client *storage.Client
}

// NewGCS instantiates a new GCS client wrapper
func NewGCS(ctx context.Context) (GCS, error) {
	client, err := storage.NewClient(ctx)
	if err != nil {
		return nil, err
	}
	return &gcs{
		ctx:    ctx,
		client: client,
	}, nil
}
