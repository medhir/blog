package cf

import (
	"bytes"
	"context"
	"github.com/cloudflare/cloudflare-go"
	"io"
	"net/url"
	"strings"
)

type CF interface {
	AddImage(buf []byte) (*cloudflare.Image, error)
	DeleteImage(cdnURL string) error
}

type cf struct {
	ctx       context.Context
	api       *cloudflare.API
	accountID string
}

func NewCF(ctx context.Context, apiKey, email, accountID string) (CF, error) {
	api, err := cloudflare.New(apiKey, email)
	if err != nil {
		return nil, err
	}
	return &cf{
		ctx:       ctx,
		api:       api,
		accountID: accountID,
	}, nil
}

func (cf *cf) AddImage(buf []byte) (*cloudflare.Image, error) {
	r := bytes.NewReader(buf)
	rc := io.NopCloser(r)
	imgUpload, err := cf.api.UploadImage(cf.ctx, cloudflare.AccountIdentifier(cf.accountID), cloudflare.UploadImageParams{
		File: rc,
	})
	if err != nil {
		return nil, err
	}
	return &imgUpload, nil
}

func (cf *cf) DeleteImage(cdnURL string) error {
	parsedURL, err := url.Parse(cdnURL)
	if err != nil {
		return err
	}
	// Extract the id from the URL
	urlPath := parsedURL.Path
	segments := strings.Split(urlPath, "/")
	println(segments)
	err = cf.api.DeleteImage(cf.ctx, cloudflare.AccountIdentifier(cf.accountID), segments[len(segments)-2])
	if err != nil {
		return err
	}
	return nil
}
