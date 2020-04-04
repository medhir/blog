package util

// StatusCodeIsSuccessful determines whether or not a status code
// represents a successful server response
func StatusCodeIsSuccessful(statusCode int) bool {
	return statusCode >= 200 && statusCode < 300
}
