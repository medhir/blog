package api

import (
	"fmt"

	"gopkg.in/h2non/bimg.v1"
)

var stripMetadata = bimg.Options{
	NoAutoRotate:  false,
	StripMetadata: true}

var reduceQualityAndInterlace = bimg.Options{
	Quality:   85,
	Interlace: true}

func reduceFileSizeAndConvertToJPG(buffer []byte) []byte {
	image := bimg.NewImage(buffer)
	_, err := image.Process(stripMetadata)
	if err != nil {
		fmt.Println("Could not convert to JPEG - ", err.Error())
	}
	_, err = image.Convert(bimg.JPEG)
	if err != nil {
		fmt.Println("Could not convert to JPEG - ", err.Error())
	}
	size, err := image.Size()
	if err != nil {
		fmt.Println("Could not get image size - ", err.Error())
	}
	if size.Width > 1000 {
		scale := float64(size.Width) / float64(size.Height)
		newWidth := 1000
		newHeight := int(1000 / scale)
		_, err = image.Resize(newWidth, newHeight)
		if err != nil {
			fmt.Println("Could not resize image - ", err.Error())
		}
	}
	_, err = image.Process(reduceQualityAndInterlace)
	if err != nil {
		fmt.Println("Could not reduce image quality - ", err.Error())
	}
	return image.Image()
}
