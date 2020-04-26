import React from 'react'
import Photos from './index'
import Layout from '../../components/layout'
import { shallow } from 'enzyme'

describe('Photos', () => {
  const photos = [
    'https://photo.com/1',
    'https://photo.com/2',
    'https://photo.com/3',
    'https://photo.com/4',
    'https://photo.com/5',
    'https://photo.com/6',
    'https://photo.com/7',
  ]
  it('renders photos', () => {
    const wrapper = shallow(<Photos photos={photos} />)
    expect(wrapper.find('img').length).toEqual(5)
    expect(wrapper.find(Layout).length).toEqual(1)
  })
})
