// Code generated by mockery v1.1.1. DO NOT EDIT.

package code

import mock "github.com/stretchr/testify/mock"

// MockManager is an autogenerated mock type for the Manager type
type MockManager struct {
	mock.Mock
}

// AddInstance provides a mock function with given fields:
func (_m *MockManager) AddInstance() (*Instance, error) {
	ret := _m.Called()

	var r0 *Instance
	if rf, ok := ret.Get(0).(func() *Instance); ok {
		r0 = rf()
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(*Instance)
		}
	}

	var r1 error
	if rf, ok := ret.Get(1).(func() error); ok {
		r1 = rf()
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// RemoveInstance provides a mock function with given fields: id
func (_m *MockManager) RemoveInstance(id string) error {
	ret := _m.Called(id)

	var r0 error
	if rf, ok := ret.Get(0).(func(string) error); ok {
		r0 = rf(id)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}