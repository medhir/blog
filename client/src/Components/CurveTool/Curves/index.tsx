import React, { Component } from 'react'
import Curve from 'Components/CurveTool/Curve'
import { Point, Rule } from 'Components/CurveTool/Curve/types'
import Inputs from './controls'
import './index.css'

interface CurveData {
  points: Point[]
  rules: Rule[]
  strokeWidth: number
}

interface CurveProps {
  gridSize: number
  cellSize?: number
}

interface CurvesState {
  cellSize: number
  curves: CurveData[]
  currentCurveIndex: number
  gridChecked: boolean
  strokeWidth: number
}

const InitialStrokeWidth = 2
const InitialCellSize = 25

class Curves extends Component<CurveProps, CurvesState> {
  constructor(props: CurveProps) {
    super(props)
    const { cellSize } = this.props
    this.state = {
      strokeWidth: InitialStrokeWidth,
      gridChecked: true,
      cellSize: cellSize ? cellSize : InitialCellSize,
      curves: [
        {
          points: [],
          rules: [],
          strokeWidth: InitialStrokeWidth,
        },
      ],
      currentCurveIndex: 0,
    }
    this.updateStrokeWidth = this.updateStrokeWidth.bind(this)
    this.updateCellSize = this.updateCellSize.bind(this)
    this.toggleGrid = this.toggleGrid.bind(this)
  }

  /**
   * updateCellSize updates the size of cells in the grid
   * @param e
   */
  updateCellSize(e: Event): void {
    const updatedCellSize = Number((e.target as HTMLInputElement).value)
    this.setState({ cellSize: updatedCellSize })
  }

  /**
   * updateStrokeWidth updates the application's stroke width, as well as the current curve's stroke width
   * @param e
   */
  updateStrokeWidth(e: Event): void {
    const { curves, currentCurveIndex } = this.state
    const updatedWidth = Number((e.target as HTMLInputElement).value)
    this.setState({ strokeWidth: updatedWidth })
    const newCurves = curves.slice()
    newCurves[currentCurveIndex].strokeWidth = updatedWidth
    this.setState({ curves: newCurves })
  }

  /**
   * toggleGrid toggles the visibility of the grid
   * @param e
   */
  toggleGrid(e: Event): void {
    const { gridChecked } = this.state
    this.setState({
      gridChecked: !gridChecked,
    })
  }

  render() {
    const { gridSize } = this.props
    const {
      cellSize,
      curves,
      currentCurveIndex,
      gridChecked,
      strokeWidth,
    } = this.state
    return (
      <div className="Curves">
        <Inputs
          cellSize={cellSize}
          gridChecked={gridChecked}
          strokeWidth={strokeWidth}
          toggleGrid={this.toggleGrid}
          updateCellSize={this.updateCellSize}
          updateStrokeWidth={this.updateStrokeWidth}
        />
        <svg className="FullHeight">
          <Curve
            cellSize={cellSize}
            gridSize={gridSize}
            markFilled={() => {}}
            points={curves[currentCurveIndex].points}
            rules={curves[currentCurveIndex].rules}
            visible={gridChecked}
          />
        </svg>
      </div>
    )
  }
}

export default Curves
