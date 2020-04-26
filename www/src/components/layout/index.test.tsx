import React from 'react'
import Layout from './index'
import { shallow } from 'enzyme'
import Header from './header'
import Footer from './footer'

describe('Layout', () => {
  it('renders the proper layout', () => {
    const wrapper = shallow(<Layout />)
    expect(wrapper.find(Header).length).toEqual(1)
    expect(wrapper.find('main').length).toEqual(1)
    expect(wrapper.find(Footer).length).toEqual(1)
  })
})
