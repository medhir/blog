package api

import (
	"fmt"

	"gopkg.in/h2non/bimg.v1"
)

var reduceQuality = bimg.Options{
	Quality: 30}

var watermark = bimg.Watermark{
	Text:        "(c) medhir 2019",
	Opacity:     0.30,
	Width:       300,
	DPI:         100,
	Margin:      100,
	NoReplicate: true,
	Font:        "sans bold 22",
	Background:  bimg.Color{R: 255, G: 255, B: 255},
}

func reduceFileSizeAndConvertToJPG(buffer []byte) []byte {
	image := bimg.NewImage(buffer)
	_, err := image.Process(reduceQuality)
	if err != nil {
		fmt.Println("Could not reduce image quality - ", err.Error())
	}
	_, err = image.Convert(bimg.JPEG)
	if err != nil {
		fmt.Println("Could not convert to JPEG - ", err.Error())
	}
	finalJpg, err := image.Watermark(watermark)
	if err != nil {
		fmt.Println("Could not add watermark - ", err.Error())
	}
	return finalJpg
}
