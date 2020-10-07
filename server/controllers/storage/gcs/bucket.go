package gcs

import (
	"context"
	"time"
)

func (gcs *gcs) CreateBucket(name string) error {
	ctx, cancel := context.WithTimeout(gcs.ctx, time.Second*10)
	defer cancel()
	bucket := gcs.client.Bucket(name)
	err := bucket.Create(ctx, projectID, nil)
	if err != nil {
		return err
	}
	return nil
}

func (gcs *gcs) DeleteBucket(name string) error {
	ctx, cancel := context.WithTimeout(gcs.ctx, time.Second*10)
	defer cancel()
	bucket := gcs.client.Bucket(name)
	err := bucket.Delete(ctx)
	if err != nil {
		return err
	}
	return nil
}
