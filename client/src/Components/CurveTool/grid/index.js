/**
 * Grid
 *
 * Sets / animates the drawing of a path to generate curve on a grid.
 * Highlight a set of squares on a grid to generate curve.
 */

import React, { Component } from 'react'
import Square from './square'

const SquareSize = 20

class Grid extends Component {
  constructor(props) {
    super(props)
  }

  generate({ x, y }) {
    const xSquares = Math.floor(x / SquareSize)
    const ySquares = Math.floor(y / SquareSize)
    const squares = []
    for (let i = 0; i < xSquares; i++) {
      for (let j = 0; j < ySquares; j++) {
        squares.push(
          <Square
            x={i * SquareSize + SquareSize}
            y={j * SquareSize + SquareSize}
            size={SquareSize}
            key={`${i},${j}`}
          />
        )
      }
    }
    return squares
  }

  render() {
    const { dimensions } = this.props
    const squares = this.generate(dimensions)
    return (
      <svg class="fullHeight">
        <g>{squares}</g>
      </svg>
    )
  }
}

export default Grid
