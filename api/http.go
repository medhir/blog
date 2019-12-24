package api

import (
	"crypto/tls"
	"net/http"
	"time"
)

var transport = &http.Transport{
	TLSClientConfig: &tls.Config{
		InsecureSkipVerify: true,
	},
}
var httpClient = &http.Client{
	Transport: transport,
	Timeout:   time.Second * 10,
}
