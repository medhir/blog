// Code generated by mockery v1.0.0. DO NOT EDIT.

package gcs

import mock "github.com/stretchr/testify/mock"

// MockGCS is an autogenerated mock type for the GCS type
type MockGCS struct {
	mock.Mock
}

// DeleteObject provides a mock function with given fields: name, bucket
func (_m *MockGCS) DeleteObject(name string, bucket string) error {
	ret := _m.Called(name, bucket)

	var r0 error
	if rf, ok := ret.Get(0).(func(string, string) error); ok {
		r0 = rf(name, bucket)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// GetObject provides a mock function with given fields: name, bucket
func (_m *MockGCS) GetObject(name string, bucket string) ([]byte, error) {
	ret := _m.Called(name, bucket)

	var r0 []byte
	if rf, ok := ret.Get(0).(func(string, string) []byte); ok {
		r0 = rf(name, bucket)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).([]byte)
		}
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(string, string) error); ok {
		r1 = rf(name, bucket)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// ListObjects provides a mock function with given fields: bucket, prefix
func (_m *MockGCS) ListObjects(bucket string, prefix string) ([]*Object, error) {
	ret := _m.Called(bucket, prefix)

	var r0 []*Object
	if rf, ok := ret.Get(0).(func(string, string) []*Object); ok {
		r0 = rf(bucket, prefix)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).([]*Object)
		}
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(string, string) error); ok {
		r1 = rf(bucket, prefix)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// UploadObject provides a mock function with given fields: name, bucket, obj
func (_m *MockGCS) UploadObject(name string, bucket string, obj []byte) error {
	ret := _m.Called(name, bucket, obj)

	var r0 error
	if rf, ok := ret.Get(0).(func(string, string, []byte) error); ok {
		r0 = rf(name, bucket, obj)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}