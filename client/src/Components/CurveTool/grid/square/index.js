/**
 * Square
 *
 * Implements a draggable <rect> svg element, for use in a Grid element.
 */

import React, { Component } from 'react'

class Square extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stroke: 'black',
      fill: 'white',
    }
  }

  onDragStart() {
    this.setState({
      fill: 'red',
    })
  }

  render() {
    const { x, y, size } = this.props
    const { stroke, fill } = this.state
    return (
      <rect
        x={x}
        y={y}
        width={size}
        height={size}
        stroke={stroke}
        fill={fill}
        draggable
        onMouseDown={this.onDragStart.bind(this)}
        onDragStart={this.onDragStart.bind(this)}
      />
    )
  }
}

export default Square
