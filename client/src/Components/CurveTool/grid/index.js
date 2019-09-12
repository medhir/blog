import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Cell from './cell'
import { Generator } from './generator'
import './index.css'

export default class Grid extends Component {
  constructor(props) {
    super(props)
    const { gridSize } = props
    this.state = {
      fillMatrix: Generator(gridSize),
      validMatrix: null,
      line: null,
      position: null,
    }

    this.markAsFilled = this.markAsFilled.bind(this)
    this.calculateValidMatrix = this.calculateValidMatrix.bind(this)
    this.undo = this.undo.bind(this)
  }

  componentDidMount() {
    window.addEventListener('keydown', this.undo)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.undo)
  }

  undo(e) {
    if (e.metaKey && e.keyCode === 90) {
      debugger
      const { line } = this.state
      const newLine = line.slice()
      newLine.pop()
      this.setState({ line: newLine }, this.calculateValidMatrix)
    }
  }

  markAsFilled(rowIndex, colIndex) {
    const newFilled = this.state.fillMatrix.slice()
    newFilled[rowIndex][colIndex] = 1
    this.setState({ fillMatrix: newFilled })
    this.addToLine(rowIndex, colIndex)
  }

  unfill(rowIndex, colIndex) {
    const newFilled = this.state.fillMatrix.slice()
    newFilled[rowIndex][colIndex] = 0
    this.setState({ fillMatrix: newFilled })
  }

  addToLine(rowIndex, colIndex) {
    const { line } = this.state
    if (!line) {
      this.setState(
        {
          line: [[rowIndex, colIndex]],
          position: { x: rowIndex, y: colIndex },
        },
        this.calculateValidMatrix
      )
    } else {
      const newLine = line.slice()
      newLine.push([rowIndex, colIndex])
      this.setState(
        {
          line: newLine,
          position: { x: rowIndex, y: colIndex },
        },
        this.calculateValidMatrix
      )
    }
  }

  calculateValidMatrix() {
    const { gridSize } = this.props
    const { position, fillMatrix } = this.state
    const { x, y } = position
    const newValidMatrix = Generator(gridSize)
    // check left
    if (x - 1 > -1 && !fillMatrix[x - 1][y]) {
      newValidMatrix[x - 1][y] = 1
    }
    // check right
    if (x + 1 < gridSize && !fillMatrix[x + 1][y]) {
      newValidMatrix[x + 1][y] = 1
    }
    // check top
    if (y - 1 > -1 && !fillMatrix[x][y - 1]) {
      newValidMatrix[x][y - 1] = 1
    }
    // check bottom
    if (y + 1 < gridSize && !fillMatrix[x][y + 1]) {
      newValidMatrix[x][y + 1] = 1
    }
    this.setState({ validMatrix: newValidMatrix })
  }

  render() {
    const { fillMatrix, validMatrix } = this.state
    const { cellSize } = this.props
    return (
      <svg className="fullHeight">
        <g>
          {fillMatrix.map((row, rowIndex) => (
            <g>
              {row.map((cell, colIndex) => (
                <Cell
                  x={10 + colIndex * cellSize}
                  y={10 + rowIndex * cellSize}
                  size={cellSize}
                  filled={cell !== 0}
                  valid={validMatrix ? validMatrix[rowIndex][colIndex] : true}
                  markAsFilled={this.markAsFilled}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                />
              ))}
            </g>
          ))}
        </g>
      </svg>
    )
  }
}

Grid.propTypes = {
  cellSize: PropTypes.number.isRequired,
  gridSize: PropTypes.number.isRequired,
}
