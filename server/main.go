package main

import (
	"log"

	"github.com/medhir/blog/server/instance"
)

func main() {
	instance, err := instance.NewInstance()
	if err != nil {
		log.Panicf("Unable to start instance - %v", err)
	}
	instance.Start()
}
