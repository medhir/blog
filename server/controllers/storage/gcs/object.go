package gcs

import (
	"cloud.google.com/go/storage"
	"context"
	"fmt"
	"google.golang.org/api/iterator"
	"io/ioutil"
	"sort"
	"strings"
	"time"
)

func (gcs *gcs) GetObjectMetadata(name, bucket string) (*storage.ObjectAttrs, error) {
	ctx, cancel := context.WithTimeout(gcs.ctx, time.Second*60)
	defer cancel()
	attrs, err := gcs.client.Bucket(bucket).Object(name).Attrs(ctx)
	if err != nil {
		return nil, err
	}
	return attrs, nil
}

// GetObject reads the data from an object into a buffer
func (gcs *gcs) GetObject(name, bucket string) ([]byte, error) {
	ctx, cancel := context.WithTimeout(gcs.ctx, time.Second*60)
	defer cancel()
	r, err := gcs.client.Bucket(bucket).Object(name).NewReader(ctx)
	if err != nil {
		return nil, fmt.Errorf("Unable to create reader for object %s in bucket %s: %s", name, bucket, err.Error())
	}
	defer r.Close()
	data, err := ioutil.ReadAll(r)
	if err != nil {
		return nil, fmt.Errorf("Unable to read object %s in bucket %s: %s", name, bucket, err.Error())
	}
	return data, nil
}

// UploadObject uploads a data buffer into a gcs object
func (gcs *gcs) UploadObject(name, bucket string, obj []byte, public bool) error {
	ctx, cancel := context.WithTimeout(gcs.ctx, time.Second*60)
	defer cancel()
	wc := gcs.client.Bucket(bucket).Object(name).NewWriter(ctx)
	if _, err := wc.Write(obj); err != nil {
		return fmt.Errorf("Unable to write object %s to bucket %s: %s", name, bucket, err.Error())
	}
	if err := wc.Close(); err != nil {
		return fmt.Errorf("Unable to close writer (object %s, bucket %s): %s", name, bucket, err.Error())
	}
	if public {
		acl := gcs.client.Bucket(bucket).Object(name).ACL()
		if err := acl.Set(ctx, storage.AllUsers, storage.RoleReader); err != nil {
			return err
		}
	}
	return nil
}

// DeleteObject removes an object from gcs
func (gcs *gcs) DeleteObject(name, bucket string) error {
	ctx, cancel := context.WithTimeout(gcs.ctx, time.Second*10)
	defer cancel()
	obj := gcs.client.Bucket(bucket).Object(name)
	if err := obj.Delete(ctx); err != nil {
		return fmt.Errorf("Unable to delete object %s to bucket %s: %s", name, bucket, err.Error())
	}
	return nil
}

// Object describes the metadata associated with an object in gcs
type Object struct {
	Name     string
	URL      string
	Bucket   string
	Created  time.Time
	Updated  time.Time
	ACL      []storage.ACLRule
	Metadata map[string]string
}

// Objects describes metadata for multiple gcs objects
type Objects []*Object

// ListObjects retrieves the metadata for objects in a bucket
// Objects can be found in "folders" by specifying a non-empty prefix.
// ListObjects only returns objects at the root "folder" specified by the prefix
func (gcs *gcs) ListObjects(bucket, prefix string) (Objects, error) {
	ctx, cancel := context.WithTimeout(gcs.ctx, time.Second*10)
	defer cancel()
	// https://cloud.google.com/storage/docs/listing-objects#storage-list-objects-go
	it := gcs.client.Bucket(bucket).Objects(ctx, &storage.Query{
		Prefix:    prefix,
		Delimiter: "/",
	})

	objects := []*Object{}
	for {
		attrs, err := it.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, fmt.Errorf("Unable to get objects under %s in bucket %s: %s", prefix, bucket, err.Error())
		}

		objects = append(objects, &Object{
			Name:     attrs.Name,
			URL:      attrs.MediaLink,
			Bucket:   attrs.Bucket,
			Created:  attrs.Created,
			Updated:  attrs.Updated,
			ACL:      attrs.ACL,
			Metadata: attrs.Metadata,
		})
	}
	return objects, nil
}

// BySorter is a type to describe the way a list of objects can be sorted
type BySorter string

const (
	// ByDateDescending sorts objects by date in descending order (Most to least recent)
	ByDateDescending BySorter = "DateDescending"
	// ByDateAscending sorts objects by date in ascending order (Least to most recent)
	ByDateAscending BySorter = "DateAscending"
	// ByName sorts objects by the object names alphabetically
	ByName BySorter = "ByName"
)

// Sort returns a sorted slice of objects, as determined by the passed in BySorter.
// If the passed in BySorter is undefined, the original slice will be returned.
func (o Objects) Sort(bySorter BySorter) {
	switch bySorter {
	case ByDateDescending:
		sort.Slice(o, func(i, j int) bool {
			return o[i].Created.After(o[j].Created)
		})
	case ByDateAscending:
		sort.Slice(o, func(i, j int) bool {
			return o[i].Created.Before(o[j].Created)
		})
	case ByName:
		sort.Slice(o, func(i, j int) bool {
			return strings.ToLower(o[i].Name) < strings.ToLower(o[j].Name)
		})
	}
}
