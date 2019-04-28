package api

import (
	"bytes"
	"encoding/json"
	"errors"
)

// BlogPosts is the folder prefix for blog posts
const BlogPosts = "blog/posts/"

// BlogDrafts is the folder prefix for blog drafts
const BlogDrafts = "blog/drafts/"

const postsIndexKey = "blog/posts.index.json"
const draftsIndexKey = "blog/drafts.index.json"

// BlogPostEntry describes the json encoding for a blog post
type BlogPostEntry struct {
	Title     string  `json:"title"`
	TitlePath string  `json:"titlePath"`
	Markdown  string  `json:"markdown"`
	Published float64 `json:"published"`
	ID        string  `json:"id"`
}

type blogPostIndexEntry struct {
	Title     string  `json:"title"`
	TitlePath string  `json:"titlePath"`
	Published float64 `json:"published"`
	ID        string  `json:"id"`
}

func getBlogIndex() ([]byte, error) {
	index, err := getBytesForObject(postsIndexKey)
	return index, err
}

func getDraftIndex() ([]byte, error) {
	index, err := getBytesForObject(draftsIndexKey)
	return index, err
}

// BlogDraftEntry is the JSON data sent by the client to save a draft
type BlogDraftEntry struct {
	ID       string  `json:"id"`
	Markdown string  `json:"markdown"`
	Saved    float64 `json:"saved"`
	Title    string  `json:"title"`
}

type blogDraftIndexEntry struct {
	ID    string  `json:"id"`
	Saved float64 `json:"saved"`
	Title string  `json:"title"`
}

func updateDraftIndex(body []byte) error {
	draftKeys, err := getKeysByMostRecent(BlogDrafts)
	if err != nil {
		return errors.New("Failed to get draft object keys - " + err.Error())
	}
	var index []blogDraftIndexEntry
	for _, key := range draftKeys {
		draftBytes, err := getBytesForObject(key)
		if err != nil {
			return errors.New("Failed to get draft bytes for key " + key + " - " + err.Error())
		}
		entry := BlogDraftEntry{}
		err = json.Unmarshal(draftBytes, &entry)
		if err != nil {
			return errors.New("Failed to construct draft entry. Method error - " + err.Error())
		}
		indexEntry := blogDraftIndexEntry{
			ID:    entry.ID,
			Saved: entry.Saved,
			Title: entry.Title}
		index = append(index, indexEntry)
	}
	newJSON, err := json.Marshal(index)
	if err != nil {
		return errors.New("Failed to create json for updated draft index")
	}
	_, err = putObject(bytes.NewReader(newJSON), draftsIndexKey)
	if err != nil {
		return errors.New("Failed to put updated draft index")
	}
	return nil
}

// updateBlogIndex writes an updated json file of all blog posts
func updateBlogIndex(post []byte) error {
	postKeys, err := getKeysByMostRecent(BlogPosts)
	if err != nil {
		return errors.New("Failed to get post object keys - " + err.Error())
	}
	var index []blogPostIndexEntry
	for _, key := range postKeys {
		postBytes, err := getBytesForObject(key)
		if err != nil {
			return errors.New("Failed to get bytes for key " + key + " - " + err.Error())
		}
		entry := BlogPostEntry{}
		err = json.Unmarshal(postBytes, &entry)
		if err != nil {
			return errors.New("Failed to construct post entry. Method error - " + err.Error())
		}
		indexEntry := blogPostIndexEntry{
			ID:        entry.ID,
			TitlePath: entry.TitlePath,
			Published: entry.Published,
			Title:     entry.Title}
		index = append(index, indexEntry)
	}
	newJSON, err := json.Marshal(index)
	if err != nil {
		return errors.New("Failed to create json for updated post index")
	}
	_, err = putObject(bytes.NewReader(newJSON), postsIndexKey)
	if err != nil {
		return errors.New("Failed to put updated posts index")
	}
	return nil
}
