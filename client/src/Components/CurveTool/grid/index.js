import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Cell from './cell'
import { EmptyMatrix, TileRules, Tiles } from './generator'
import './index.css'

export default class Grid extends Component {
  constructor(props) {
    super(props)
    const { gridSize } = props
    this.state = {
      fillMatrix: EmptyMatrix(gridSize),
      validMatrix: null,
      line: null,
      position: null,
      tileRules: null,
    }

    this.markFilled = this.markFilled.bind(this)
    this.calculateValidMatrix = this.calculateValidMatrix.bind(this)
    this.calculateValidTilesAndRules = this.calculateValidTilesAndRules.bind(
      this
    )
  }

  componentDidMount() {
    window.addEventListener('keydown', () => {})
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', () => {})
  }

  /**
   * markAsFilled
   * @param {Object} props
   * @param {Number} props.x the row position in the grid
   * @param {Number} props.y the column position in the grid
   * @param {Number} props.svgX the x coordinate for svg draw
   * @param {Number} props.svgY the y coordinate for svg draw
   */
  markFilled({ x, y, svgX, svgY }) {
    const { line } = this.state
    const newFilled = this.state.fillMatrix.slice()
    newFilled[x][y] = 1
    this.setState({ fillMatrix: newFilled })
    this.addToLine({ x, y, svgX, svgY })
  }

  unfill(x, y) {
    const newFilled = this.state.fillMatrix.slice()
    newFilled[x][y] = 0
    this.setState({ fillMatrix: newFilled })
  }

  addToLine({ x, y, svgX, svgY }) {
    const { line } = this.state
    if (!line) {
      this.setState(
        {
          line: [{ x, y, svgX, svgY }],
          position: { x: x, y: y },
        },
        this.calculateValidTilesAndRules
      )
    } else {
      const newLine = line.slice()
      newLine.push({ x, y, svgX, svgY })
      this.setState(
        {
          line: newLine,
          position: { x: x, y: y },
        },
        this.calculateValidTilesAndRules
      )
    }
  }

  calculateValidTilesAndRules() {
    const { line } = this.state
    this.calculateValidMatrix()
    this.setState({
      tileRules: TileRules(line),
    })
  }
  /**
   * calculateValidMatrix calculates whether or not a cell can be added to the line
   */
  calculateValidMatrix() {
    const { gridSize } = this.props
    const { position, fillMatrix } = this.state
    const { x, y } = position
    const newValidMatrix = EmptyMatrix(gridSize)
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
    const { fillMatrix, validMatrix, line, tileRules } = this.state
    const { cellSize } = this.props
    return (
      <svg className="fullHeight">
        <g>
          {fillMatrix.map((row, x) => (
            <g>
              {row.map((cell, y) => (
                <Cell
                  x={x}
                  y={y}
                  svgX={10 + x * cellSize}
                  svgY={10 + y * cellSize}
                  size={cellSize}
                  filled={cell !== 0}
                  valid={validMatrix ? validMatrix[x][y] : true}
                  markFilled={this.markFilled}
                />
              ))}
            </g>
          ))}
        </g>
        {tileRules && (
          <Tiles cellSize={cellSize} rules={tileRules} line={line} />
        )}
      </svg>
    )
  }
}

Grid.propTypes = {
  cellSize: PropTypes.number.isRequired,
  gridSize: PropTypes.number.isRequired,
}
