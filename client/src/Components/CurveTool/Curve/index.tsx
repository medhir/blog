import React, { Component } from 'react'
import Cell from './cell'
import { Matrix, ValidMatrix } from './util'
import { Point, Rule } from './types'

export interface CurveProps {
  cellSize: number
  className: string
  fillMatrix?: boolean[][]
  gridSize: number
  markFilled: (point: Point) => void
  points: Point[]
  rules: Rule[]
  visible: boolean
}

export interface CurveState {
  fillMatrix: boolean[][]
  validMatrix: boolean[][]
}

export default class Curve extends Component<CurveProps, CurveState> {
  constructor(props: CurveProps) {
    super(props)
    const { gridSize, fillMatrix } = this.props
    this.state = {
      fillMatrix: fillMatrix ? fillMatrix : Matrix(gridSize, false),
      validMatrix: [],
    }
  }

  componentDidMount() {
    const { fillMatrix, validMatrix } = this.state
    if (fillMatrix.length === 0 || validMatrix.length === 0) {
      this.setState({
        validMatrix: ValidMatrix(this.props, this.state),
      })
    }
  }

  render() {
    const { cellSize, fillMatrix, markFilled, visible } = this.props
    const { validMatrix } = this.state
    return (
      <g>
        {fillMatrix &&
          fillMatrix.map((row, x) => (
            <g>
              {row.map((cell, y) => (
                <Cell
                  x={x}
                  y={y}
                  svgX={10 + x * cellSize}
                  svgY={10 + y * cellSize}
                  size={cellSize}
                  filled={cell !== false}
                  valid={validMatrix ? validMatrix[x][y] : true}
                  visible={visible}
                  markFilled={markFilled}
                />
              ))}
            </g>
          ))}
      </g>
    )
  }
}
