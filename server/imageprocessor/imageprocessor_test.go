package imageprocessor

import (
	"image/jpeg"
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_megabytes(t *testing.T) {
	tests := []struct {
		name     string
		input    []byte
		expected float64
	}{
		{
			name:     "2 megabytes",
			input:    make([]byte, 1024*1024*2),
			expected: float64(2),
		},
		{
			name:     "6 megabytes",
			input:    make([]byte, 1024*1024*6),
			expected: float64(6),
		},
		{
			name:     "60 megabytes",
			input:    make([]byte, 1024*1024*60),
			expected: float64(60),
		},
	}

	p := &imageProcessor{}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			actual := p.megabytes(tt.input)
			assert.Equal(t, tt.expected, actual)
		})
	}
}

func Test_getJpgOptions(t *testing.T) {
	tests := []struct {
		name     string
		input    []byte
		expected *jpeg.Options
		err      bool
	}{
		{
			name:  "2 megabytes",
			input: make([]byte, 1024*1024*2),
			expected: &jpeg.Options{
				Quality: 90,
			},
			err: false,
		},
		{
			name:  "4 megabytes",
			input: make([]byte, 1024*1024*4),
			expected: &jpeg.Options{
				Quality: 80,
			},
			err: false,
		},
		{
			name:  "6 megabytes",
			input: make([]byte, 1024*1024*6),
			expected: &jpeg.Options{
				Quality: 60,
			},
			err: false,
		},
		{
			name:  "15 megabytes",
			input: make([]byte, 1024*1024*6),
			expected: &jpeg.Options{
				Quality: 40,
			},
			err: false,
		},
		{
			name:     "60 megabytes",
			input:    make([]byte, 1024*1024*60),
			expected: nil,
			err:      true,
		},
	}

	p := &imageProcessor{}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			actual, err := p.getJpgOptions(tt.input)
			assert.Equal(t, tt.expected, actual)
			if tt.err {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}
		})
	}
}
