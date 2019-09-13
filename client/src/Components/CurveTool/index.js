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
    }
    this.updateStrokeWidth.bind(this)
    this.updateCellSize.bind(this)
  }

  updateStrokeWidth(e) {
    const updatedWidth = e.target.value
    this.setState({ strokeWidth: updatedWidth })
  }

  updateCellSize(e) {
    const updatedCellSize = e.target.value
    this.setState({ cellSize: updatedCellSize })
  }

  render() {
    const { strokeWidth, cellSize } = this.state

    return (
      <section className="curveTool">
        <h2>curve.tool</h2>
        <p>
          vector-based space filling curve generator for electrode patterning.
        </p>
        <h3>Tile-based Interface</h3>
        <p>
          Tile primitives that scale / connect seamlessly. Randomize orientation
          on a path to minimize strain on electrode wires.
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
        <label htmlFor="cellSize">Cell Size</label>
        <input
          type="range"
          name="cellSize"
          min="0"
          max="100"
          value={cellSize}
          id="cellSize"
          onChange={this.updateCellSize.bind(this)}
        />
        <Grid gridSize={10} cellSize={cellSize} />
        {/* <svg className="fullHeight">
          <SampleCurve
            radius={radius}
            strokeWidth={strokeWidth}
            start={{ x: 50, y: 50 }}
          />
        </svg> */}
      </section>
    )
  }
}

export default CurveTool
