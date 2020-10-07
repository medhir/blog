package blog

import (
	"fmt"
	uuid2 "github.com/google/uuid"
)

func (b *blog) AddAsset(postID string, data []byte) (url string, _ error) {
	objectName := fmt.Sprintf("blog/assets/%s/%s.jpg", postID, uuid2.New())
	err := b.gcs.UploadObject(objectName, bucket, data, true)
	if err != nil {
		return "", err
	}
	attrs, err := b.gcs.GetObjectMetadata(objectName, bucket)
	if err != nil {
		return "", err
	}
	err = b.db.AddAsset(postID, objectName, attrs.MediaLink)
	if err != nil {
		return "", err
	}
	return attrs.MediaLink, nil
}

func (b *blog) DeleteAsset(postID, name string) error {
	err := b.gcs.DeleteObject(name, bucket)
	if err != nil {
		return err
	}
	err = b.db.DeleteAsset(postID, name)
	if err != nil {
		return err
	}
	return nil
}

func (b *blog) DeleteAssets(postID string) error {
	assets, err := b.db.GetAssets(postID)
	if err != nil {
		return err
	}
	for _, asset := range assets {
		err = b.gcs.DeleteObject(asset.Name, bucket)
		if err != nil {
			return err
		}
		err = b.db.DeleteAsset(postID, asset.Name)
		if err != nil {
			return err
		}
	}
	return nil
}
