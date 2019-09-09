import React from 'react'
import { shallow } from 'enzyme'

import App from './App'
import Header from './Layout/Header'
import Main from './Layout/Main'
import Footer from './Layout/Footer'

it('renders main application elements', () => {
  const wrapper = shallow(<App />)
  expect(wrapper.contains(<Header />)).toBe(true)
  expect(wrapper.contains(<Main />)).toBe(true)
  expect(wrapper.contains(<Footer />)).toBe(true)
})
