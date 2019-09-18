import React, { Component } from 'react'

import Line from 'Components/CurveTool/LineGenerator'
import Inputs from './controls'
import './index.css'

class Lines extends Component {
  constructor(props) {
    super(props)
    this.state = {
      strokeWidth: 2.25,
      gridChecked: true,
      lines: [],
      currentLine: null,
    }
    this.updateStrokeWidth = this.updateStrokeWidth.bind(this)
    // this.updateCellSize = this.updateCellSize.bind(this)
    this.toggleCheck = this.toggleCheck.bind(this)
  }

  componentDidMount() {
    const { lines, currentLine, strokeWidth, gridChecked } = this.state
    if (!currentLine && lines.length === 0) {
      const newLines = [
        <Line
          gridSize={40}
          cellSize={33}
          className="fullHeight"
          strokeWidth={strokeWidth}
          visible={gridChecked}
        />,
      ]
      this.setState({
        lines: newLines,
        currentLine: newLines[0],
      })
    }
  }

  updateStrokeWidth(e) {
    const updatedWidth = e.target.value
    this.setState({ strokeWidth: updatedWidth })
  }

  toggleCheck(e) {
    const { gridChecked } = this.state
    this.setState({
      gridChecked: !gridChecked,
    })
  }

  render() {
    const { strokeWidth, gridChecked, lines, currentLine } = this.state
    return (
      <div className="Lines">
        <Inputs
          strokeWidth={strokeWidth}
          gridChecked={gridChecked}
          updateStrokeWidth={this.updateStrokeWidth}
          toggleGrid={this.toggleCheck}
        />
        {lines.length > 0 && currentLine}
      </div>
    )
  }
}

export default Lines
