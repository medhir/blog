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

interface CurvesState {
  strokeWidth: number
  gridChecked: boolean
  curves: CurveData[]
  currentCurveIndex: number
}

const InitialStrokeWidth = 2

class Curves extends Component<{}, CurvesState> {
  constructor(props: {}) {
    super(props)
    this.state = {
      strokeWidth: InitialStrokeWidth,
      gridChecked: true,
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
    // this.updateCellSize = this.updateCellSize.bind(this)
    this.toggleCheck = this.toggleCheck.bind(this)
  }

  updateStrokeWidth(e: Event) {
    const { curves, currentCurveIndex } = this.state
    const updatedWidth = Number((e.target as HTMLInputElement).value)
    this.setState({ strokeWidth: updatedWidth })
    const newCurves = curves.slice()
    newCurves[currentCurveIndex].strokeWidth = updatedWidth
    this.setState({ curves: newCurves })
  }

  toggleCheck(e: Event) {
    const { gridChecked } = this.state
    this.setState({
      gridChecked: !gridChecked,
    })
  }

  render() {
    const { strokeWidth, gridChecked } = this.state
    return (
      <div className="Curves">
        <Inputs
          strokeWidth={strokeWidth}
          gridChecked={gridChecked}
          updateStrokeWidth={this.updateStrokeWidth}
          toggleGrid={this.toggleCheck}
        />
        <svg className="FullHeight" />
      </div>
    )
  }
}

export default Curves
