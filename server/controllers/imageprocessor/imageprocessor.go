package imageprocessor

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"image"
	"image/color"
	"image/draw"
	"image/gif"
	"image/jpeg"
	"log"
	"net/http"

	"github.com/disintegration/imaging"
)

const (
	// MimeTypeGIF is the mime type associated with .gif files
	MimeTypeGIF = "image/gif"
	// MimeTypeJPG is the mime type associated with .jpeg (+ .jpg) files
	MimeTypeJPG = "image/jpeg"
	// MimeTypePNG is the mime type associated with .png files
	MimeTypePNG = "image/png"
	// MimeTypeSVG is the mime type associated with .svg files
	MimeTypeSVG = "image/svg+xml"
	// MimeTypeTIFF is the mime type associated with .tiff (+ .tif) files
	MimeTypeTIFF = "image/tiff"
)

// ImageProcessor describes the interface provided by the imageprocessor package
type ImageProcessor interface {
	ProcessImage(buf []byte) ([]byte, string, error)
	GetImageDimensions(buf []byte) (*ImageDimensions, error)
	GetBlurDataURL(buf []byte) (string, error)
}

type ImageDimensions struct {
	Width  int `json:"width"`
	Height int `json:"height"`
}

type imageProcessor struct {
	MaxSizeMB int64
}

// NewImageProcessor instantiates a new image processor
func NewImageProcessor() ImageProcessor {
	return &imageProcessor{}
}

// ProcessImage determines the image file type, reduces quality if needed, converts to jpg
func (p *imageProcessor) ProcessImage(buf []byte) ([]byte, string, error) {
	// determine file type
	contentType := http.DetectContentType(buf)
	opts, err := p.getJpgOptions(buf)
	if err != nil {
		return nil, "", err
	}

	switch contentType {
	case MimeTypePNG:
		processed, err := p.processPngToJpg(buf, opts)
		if err != nil {
			return nil, "", err
		}
		return processed, MimeTypeJPG, nil
	case MimeTypeJPG:
		processed, err := p.processJpg(buf, opts)
		if err != nil {
			return nil, "", err
		}
		return processed, MimeTypeJPG, nil
	case MimeTypeGIF:
		processed, err := p.processGif(buf)
		if err != nil {
			return nil, "", err
		}
		return processed, MimeTypeGIF, nil
	default:
		return nil, "", fmt.Errorf("Could not process MIME type %s", contentType)
	}
}

func (p *imageProcessor) GetImageDimensions(buf []byte) (*ImageDimensions, error) {
	log.Println("get image dimensions")
	r := bytes.NewReader(buf)
	img, err := imaging.Decode(r, imaging.AutoOrientation(true))
	log.Println("image decoded")
	if err != nil {
		return nil, err
	}
	return &ImageDimensions{
		Width:  img.Bounds().Dx(),
		Height: img.Bounds().Dy(),
	}, nil
}

func (p *imageProcessor) GetBlurDataURL(buf []byte) (string, error) {
	r := bytes.NewReader(buf)
	img, err := imaging.Decode(r, imaging.AutoOrientation(true))
	if err != nil {
		return "", err
	}
	// Resize and blur the image
	resized := imaging.Resize(img, 10, 10, imaging.Lanczos)
	blurred := imaging.Blur(resized, 1.0)

	// Encode the blurred image to JPEG
	imgBuf := new(bytes.Buffer)
	if err := jpeg.Encode(imgBuf, blurred, nil); err != nil {
		return "", err
	}

	// Convert the JPEG bytes to a base64 string
	base64Str := base64.StdEncoding.EncodeToString(imgBuf.Bytes())

	// Create the data URL
	blurDataURL := "data:image/jpeg;base64," + base64Str
	return blurDataURL, nil
}

func (p *imageProcessor) processPngToJpg(buf []byte, opts *jpeg.Options) ([]byte, error) {
	r := bytes.NewReader(buf)
	img, err := imaging.Decode(r, imaging.AutoOrientation(true))
	if err != nil {
		return nil, err
	}
	imgWithBackground := p.addBlackBackgroundToTransparentPixels(img)
	jpgBuf, err := p.encodeJpg(imgWithBackground, opts)
	if err != nil {
		return nil, err
	}
	return jpgBuf, nil
}

func (p *imageProcessor) processJpg(buf []byte, opts *jpeg.Options) ([]byte, error) {
	r := bytes.NewReader(buf)
	img, err := imaging.Decode(r, imaging.AutoOrientation(true))
	if err != nil {
		return nil, err
	}
	jpgBuf, err := p.encodeJpg(img, opts)
	if err != nil {
		return nil, err
	}
	return jpgBuf, nil
}

func imageToPalleted(img image.Image, p color.Palette) *image.Paletted {
	b := img.Bounds()
	pm := image.NewPaletted(b, p)
	draw.FloydSteinberg.Draw(pm, b, img, image.ZP)
	return pm
}

func (p *imageProcessor) processGif(buf []byte) ([]byte, error) {
	r := bytes.NewReader(buf)
	im, err := gif.DecodeAll(r)
	if err != nil {
		return nil, err
	}
	log.Println("GIF encode start")
	var opts jpeg.Options
	opts.Quality = 70

	// Create a new RGBA image to hold the incremental frames.
	firstFrame := im.Image[0].Bounds()
	b := image.Rect(0, 0, firstFrame.Dx(), firstFrame.Dy())
	img := image.NewRGBA(b)

	// Reduce the size of each frame in the GIF
	for i, frame := range im.Image {
		bounds := frame.Bounds()
		previous := img
		draw.Draw(img, bounds, frame, bounds.Min, draw.Over)

		// compress frames
		encoded, err := p.encodeJpg(frame, &opts)
		r = bytes.NewReader(encoded)
		if err != nil {
			return nil, err
		}
		decoded, err := imaging.Decode(r, imaging.AutoOrientation(true))
		im.Image[i] = imageToPalleted(decoded, frame.Palette)

		switch im.Disposal[i] {
		case gif.DisposalBackground:
			img = image.NewRGBA(b)
		case gif.DisposalPrevious:
			img = previous
		}
	}

	// Encode the GIF back to bytes.
	var out bytes.Buffer
	if err := gif.EncodeAll(&out, im); err != nil {
		return nil, err
	}
	log.Println("GIF Encoded")
	return out.Bytes(), nil
}

func (p *imageProcessor) addBlackBackgroundToTransparentPixels(img image.Image) image.Image {
	// from https://www.socketloop.com/tutorials/golang-convert-png-transparent-background-image-to-jpg-or-jpeg-image

	// create a new Image with the same dimension of PNG image
	newImg := image.NewRGBA(img.Bounds())

	// we will use white background to replace PNG's transparent background
	// you can change it to whichever color you want with
	// a new color.RGBA{} and use image.NewUniform(color.RGBA{<fill in color>}) function
	draw.Draw(newImg, newImg.Bounds(), &image.Uniform{color.Black}, image.Point{}, draw.Src)

	// paste PNG image OVER to newImage
	draw.Draw(newImg, newImg.Bounds(), img, img.Bounds().Min, draw.Over)

	return newImg
}

func (p *imageProcessor) megabytes(buf []byte) float64 {
	kb := int64(len(buf) / 1024)
	return (float64)(kb / 1024)
}

func (p *imageProcessor) getJpgOptions(buf []byte) (*jpeg.Options, error) {
	mb := p.megabytes(buf)
	var opts jpeg.Options
	if mb <= 2 {
		opts.Quality = 90
	} else if mb <= 5 {
		opts.Quality = 80
	} else if mb <= 10 {
		opts.Quality = 60
	} else if mb <= 30 {
		opts.Quality = 40
	} else {
		return nil, fmt.Errorf("file size (%v MB) is larger than the 30MB maximum", mb)
	}
	return &opts, nil
}

func (p *imageProcessor) encodeJpg(img image.Image, opts *jpeg.Options) ([]byte, error) {
	var buffer bytes.Buffer
	err := jpeg.Encode(&buffer, img, opts)
	if err != nil {
		return nil, err
	}
	return buffer.Bytes(), nil
}
