package imageprocessor

import (
	"bytes"
	"fmt"
	"image"
	"image/color"
	"image/draw"
	"image/jpeg"
	"image/png"
	"net/http"
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
	ProcessImage(buf []byte) ([]byte, error)
}

type imageProcessor struct {
	MaxSizeMB int64
}

// NewImageProcessor instantiates a new image processor
func NewImageProcessor(maxSizeMB int64) ImageProcessor {
	return &imageProcessor{
		MaxSizeMB: maxSizeMB,
	}
}

// ProcessImage determines the image file type, reduces quality if needed, converts to jpg
func (p *imageProcessor) ProcessImage(buf []byte) ([]byte, error) {
	// determine file type
	contentType := http.DetectContentType(buf)
	opts, err := p.getJpgOptions(buf)
	if err != nil {
		return nil, err
	}

	switch contentType {
	case MimeTypePNG:
		processed, err := p.processPngToJpg(buf, opts)
		if err != nil {
			return nil, err
		}
		return processed, nil
	case MimeTypeJPG:
		processed, err := p.processJpg(buf, opts)
		if err != nil {
			return nil, err
		}
		return processed, nil
	default:
		return nil, fmt.Errorf("Could not process MIME type %s", contentType)
	}
}

func (p *imageProcessor) processPngToJpg(buf []byte, opts *jpeg.Options) ([]byte, error) {
	r := bytes.NewReader(buf)
	img, err := png.Decode(r)
	if err != nil {
		return nil, err
	}
	// TODO - Check if image is transparent before running this line
	imgWithBackground := p.addBlackBackgroundToTransparent(img)
	jpgBuf, err := p.encodeJpg(imgWithBackground, opts)
	if err != nil {
		return nil, err
	}
	return jpgBuf, nil
}

func (p *imageProcessor) processJpg(buf []byte, opts *jpeg.Options) ([]byte, error) {
	r := bytes.NewReader(buf)
	img, err := jpeg.Decode(r)
	if err != nil {
		return nil, err
	}
	jpgBuf, err := p.encodeJpg(img, opts)
	if err != nil {
		return nil, err
	}
	return jpgBuf, nil
}

func (p *imageProcessor) addBlackBackgroundToTransparent(img image.Image) image.Image {
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

func (p *imageProcessor) megabytes(buf []byte) int64 {
	return int64(len(buf) / 1024)
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
	} else if mb <= 20 {
		opts.Quality = 40
	} else {
		return nil, fmt.Errorf("file size (%v MB) is larger than the 20MB maximum", mb)
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
