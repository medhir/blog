import React, { Component } from 'react'
import './index.css'

class Loading extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loadCount: 0,
    }
  }

  componentDidMount() {
    const intervalId = setInterval(this.updateCount.bind(this), 150)
    this.setState({ intervalId: intervalId })
  }

  componentWillUnmount() {
    const { intervalId } = this.state
    clearInterval(intervalId)
  }

  updateCount() {
    const { loadCount } = this.state
    this.setState({ loadCount: loadCount + 1 })
  }

  getEllipsis() {
    const { loadCount } = this.state
    if (loadCount % 4 === 0) {
      return ''
    } else if (loadCount % 4 === 1) {
      return '.'
    } else if (loadCount % 4 === 2) {
      return '..'
    } else if (loadCount % 4 === 3) {
      return '...'
    }
  }

  render() {
    return (
      <section>
        <h2 class="loading">Loading{this.getEllipsis()}</h2>
      </section>
    )
  }
}

export default Loading
