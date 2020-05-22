package main

import (
	"gitlab.com/medhir/blog/server/instance"
	"log"
)

func main() {
	instance, err := instance.NewInstance()
	if err != nil {
		log.Panicf("Unable to start instance - %v", err)
	}
	instance.Start()
}
