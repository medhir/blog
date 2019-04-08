package api

import (
	"fmt"

	"gopkg.in/h2non/bimg.v1"
)

var reduceQuality = bimg.Options{
	Quality:       30,
	NoAutoRotate:  false,
	StripMetadata: true}

func reduceFileSizeAndConvertToJPG(buffer []byte) []byte {
	image := bimg.NewImage(buffer)
	_, err := image.Process(reduceQuality)
	if err != nil {
		fmt.Println("Could not reduce image quality - ", err.Error())
	}
	metadata, _ := image.Metadata()
	fmt.Println(metadata)
	finalJpg, err := image.Convert(bimg.JPEG)
	if err != nil {
		fmt.Println("Could not convert to JPEG - ", err.Error())
	}
	return finalJpg
}
