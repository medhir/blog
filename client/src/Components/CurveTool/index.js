import React from 'react'

import { SampleCurve } from './tile'
import Grid from './grid'

import './index.css'

class CurveTool extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      strokeWidth: 3,
      cellSize: 30,
      gridChecked: true,
    }
    this.updateStrokeWidth = this.updateStrokeWidth.bind(this)
    this.updateCellSize = this.updateCellSize.bind(this)
    this.toggleCheck = this.toggleCheck.bind(this)
  }

  updateStrokeWidth(e) {
    const updatedWidth = e.target.value
    this.setState({ strokeWidth: updatedWidth })
  }

  updateCellSize(e) {
    const updatedCellSize = e.target.value
    this.setState({ cellSize: updatedCellSize })
  }

  toggleCheck(e) {
    const { gridChecked } = this.state
    this.setState({
      gridChecked: !gridChecked,
    })
  }

  render() {
    const { strokeWidth, cellSize, gridChecked } = this.state

    return (
      <section className="curveTool">
        <h2>curvetool</h2>
        <p>curvy space filling vector generator for electrode patterning.</p>
        <h3>Tile-based Interface</h3>
        <p>
          Tile primitives can scale + connect seamlessly. Orientation on a path
          is randomized to minimize strain on electrode wires.
        </p>
        <label htmlFor="stroke-width">Stroke Width</label>
        <input
          type="range"
          name="stroke-width"
          min="0"
          max="20"
          value={strokeWidth}
          id="stroke-width"
          onChange={this.updateStrokeWidth.bind(this)}
        />
        <label htmlFor="grid">Grid</label>
        <input
          type="checkbox"
          name="grid"
          checked={gridChecked}
          onChange={this.toggleCheck}
        />
        <Grid
          gridSize={10}
          cellSize={50}
          strokeWidth={strokeWidth}
          visible={gridChecked}
        />
      </section>
    )
  }
}

export default CurveTool
