package api

import (
	"sort"

	"github.com/aws/aws-sdk-go/service/s3"
)

// By is the type of a "less" function that defines the ordering of its Object arguments.
type By func(o1, o2 *s3.Object) bool

// Sort is a method on the function type, By, that sorts the argument slice according to the function.
func (by By) Sort(objects []*s3.Object) {
	ps := &objectSorter{
		objects: objects,
		by:      by, // The Sort method's receiver is the function (closure) that defines the sort order.
	}
	sort.Sort(ps)
}

// planetSorter joins a By function and a slice of Planets to be sorted.
type objectSorter struct {
	objects []*s3.Object
	by      func(p1, p2 *s3.Object) bool // Closure used in the Less method.
}

// Len is part of sort.Interface.
func (s *objectSorter) Len() int {
	return len(s.objects)
}

// Swap is part of sort.Interface.
func (s *objectSorter) Swap(i, j int) {
	s.objects[i], s.objects[j] = s.objects[j], s.objects[i]
}

// Less is part of sort.Interface. It is implemented by calling the "by" closure in the sorter.
func (s *objectSorter) Less(i, j int) bool {
	return s.by(s.objects[i], s.objects[j])
}
