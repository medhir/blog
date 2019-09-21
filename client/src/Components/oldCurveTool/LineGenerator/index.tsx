import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { saveAs } from 'file-saver'
import Cell from './cell'
import {
  EmptyMatrix,
  NextDiagonalDirection,
  GenerateTileRules,
  Tiles,
} from './generator'
import {
  Point,
  Line,
  LineGeneratorProps,
  LineGeneratorState,
} from './interfaces'
import './index.css'
import { Directions } from 'Components/oldCurveTool/tile/utils'

export default class LineGenerator extends Component<
  LineGeneratorProps,
  LineGeneratorState
> {
  constructor(props: LineGeneratorProps) {
    super(props)
    const { gridSize } = props
    this.state = {
      fillMatrix: EmptyMatrix(gridSize),
      line: [],
      position: { x: 0, y: 0, svgX: 0, svgY: 0 },
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
  markFilled({ x, y, svgX, svgY }: Point) {
    const newFilled = this.state.fillMatrix.slice()
    newFilled[x][y] = 1
    this.setState({ fillMatrix: newFilled })
    this.addToLine({ x, y, svgX, svgY })
  }

  unfill(x: number, y: number) {
    const newFilled = this.state.fillMatrix.slice()
    newFilled[x][y] = 0
    this.setState({ fillMatrix: newFilled })
  }

  addToLine({ x, y, svgX, svgY }: Point) {
    const { line } = this.state
    if (!line) {
      const point: Point = { x, y, svgX, svgY }
      const newLine: Line = [{ x, y, svgX, svgY }]
      this.setState(
        {
          line: newLine,
          position: point,
        },
        this.calculateValidTilesAndRules
      )
    } else {
      const point: Point = { x, y, svgX, svgY }
      const newLine = line.slice()
      newLine.push(point)
      this.setState(
        {
          line: newLine,
          position: point,
        },
        this.calculateValidTilesAndRules
      )
    }
  }

  calculateValidTilesAndRules() {
    const { line } = this.state
    if (line && line.length && line.length > 1) {
      this.setState(
        {
          tileRules: GenerateTileRules(line),
        },
        this.calculateValidMatrix
      )
    }
  }
  /**
   * calculateValidMatrix calculates whether or not a cell can be added to the line
   */
  calculateValidMatrix() {
    const { gridSize } = this.props
    const { position, fillMatrix, tileRules } = this.state
    const { x, y } = position
    const prevDiagonal = tileRules
      ? tileRules[tileRules.length - 1].diagonal
      : null
    const newValidMatrix = EmptyMatrix(gridSize)
    // check left
    if (
      x - 1 > -1 && // grid boundary
      !fillMatrix[x - 1][y] // not filled
    ) {
      newValidMatrix[x - 1][y] = 1
      if (
        tileRules &&
        prevDiagonal &&
        !NextDiagonalDirection[prevDiagonal][Directions.Left]
      ) {
        // if not a valid path for tileRules, set to not valid
        newValidMatrix[x - 1][y] = 0
      }
    }
    // check right
    if (x + 1 < gridSize && !fillMatrix[x + 1][y]) {
      newValidMatrix[x + 1][y] = 1
      if (
        tileRules &&
        prevDiagonal &&
        !NextDiagonalDirection[prevDiagonal][Directions.Right]
      ) {
        newValidMatrix[x + 1][y] = 0
      }
    }
    // check top
    if (y - 1 > -1 && !fillMatrix[x][y - 1]) {
      newValidMatrix[x][y - 1] = 1
      if (
        tileRules &&
        prevDiagonal &&
        !NextDiagonalDirection[prevDiagonal][Directions.Up]
      ) {
        newValidMatrix[x][y - 1] = 0
      }
    }
    // check bottom
    if (y + 1 < gridSize && !fillMatrix[x][y + 1]) {
      newValidMatrix[x][y + 1] = 1
      if (
        tileRules &&
        prevDiagonal &&
        !NextDiagonalDirection[prevDiagonal][Directions.Down]
      ) {
        newValidMatrix[x][y + 1] = 0
      }
    }
    this.setState({ validMatrix: newValidMatrix })
  }

  /**
   * save saves the grid's generated curve
   */
  save() {
    const { line, tileRules } = this.state
    const { cellSize, strokeWidth } = this.props

    if (!tileRules || !line) {
      return
    }

    const tiles = (
      <Tiles
        cellSize={cellSize}
        rules={tileRules}
        line={line}
        strokeWidth={strokeWidth}
      />
    )
    var svgDoc = document.implementation.createDocument(
      'http://www.w3.org/2000/svg',
      'svg',
      null
    )
    ReactDOM.render(tiles, svgDoc.documentElement)
    // get the data
    var svgData = new XMLSerializer().serializeToString(svgDoc)
    var blob = new Blob([svgData])
    saveAs(blob, `curve.${Math.random()}.svg`)
  }

  render() {
    const { fillMatrix, validMatrix, line, tileRules } = this.state
    const { cellSize, className, strokeWidth, visible } = this.props
    return (
      <React.Fragment>
        <svg className={className}>
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
                    visible={visible}
                    markFilled={this.markFilled}
                  />
                ))}
              </g>
            ))}
          </g>
          {tileRules && (
            <Tiles
              cellSize={cellSize}
              rules={tileRules}
              line={line}
              strokeWidth={strokeWidth}
            />
          )}
        </svg>
        <button onClick={this.save.bind(this)}>Save</button>
      </React.Fragment>
    )
  }
}
