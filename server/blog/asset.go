package blog

import "fmt"

func (b *blog) AddAsset(postId string, data []byte) error {
	objectName := fmt.Sprintf("blog/assets/%s/%s.jpg")
	err := b.gcs.UploadObject(objectName, bucket, data, true)
	if err != nil {
		return err
	}
	attrs, err := b.gcs.GetObjectMetadata(objectName, bucket)
	if err != nil {
		return err
	}
	err = b.db.AddAsset(postId, objectName, attrs.MediaLink)
	if err != nil {
		return err
	}
	return nil
}

func (b *blog) DeleteAsset(postId, name string) error {
	err := b.gcs.DeleteObject(name, bucket)
	if err != nil {
		return err
	}
	err = b.db.DeleteAsset(postId, name)
	if err != nil {
		return err
	}
	return nil
}
