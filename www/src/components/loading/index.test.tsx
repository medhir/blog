import React from 'react'
import Loading from './index'
import { shallow } from 'enzyme'
jest.useFakeTimers()

describe('Loading component', () => {
  it('Shows a loading dialog', () => {
    const wrapper = shallow(<Loading />)
    expect(wrapper.text()).toEqual('Loading')
    jest.advanceTimersByTime(150)
    expect(wrapper.text()).toEqual('Loading.')
    jest.advanceTimersByTime(150)
    expect(wrapper.text()).toEqual('Loading..')
    jest.advanceTimersByTime(150)
    expect(wrapper.text()).toEqual('Loading...')
    jest.advanceTimersByTime(150)
    expect(wrapper.text()).toEqual('Loading')
  })
})
