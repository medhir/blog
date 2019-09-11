import React from 'react'

import { SampleCurve } from './tile'
import Grid from './grid'
import { Generator } from './grid/generator'

import './index.css'

class CurveTool extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      strokeWidth: 3,
      radius: 10,
    }
    this.updateStrokeWidth.bind(this)
    this.updateRadius.bind(this)
  }

  updateStrokeWidth(e) {
    const updatedWidth = e.target.value
    this.setState({ strokeWidth: updatedWidth })
  }

  updateRadius(e) {
    const updatedRadius = e.target.value
    this.setState({ radius: updatedRadius })
  }

  render() {
    const { strokeWidth, radius } = this.state

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
        <label for="stroke-width">Stroke Width</label>
        <input
          type="range"
          name="stroke-width"
          min="0"
          max="20"
          value={strokeWidth}
          id="stroke-width"
          onChange={this.updateStrokeWidth.bind(this)}
        />
        <label for="radius">Radius</label>
        <input
          type="range"
          name="radius"
          min="0"
          max="100"
          value={radius}
          id="radius"
          onChange={this.updateRadius.bind(this)}
        />
        <Grid backingArray={Generator(10)} />
        <svg className="fullHeight">
          <SampleCurve
            radius={radius}
            strokeWidth={strokeWidth}
            start={{ x: 50, y: 50 }}
          />
        </svg>
      </section>
    )
  }
}

export default CurveTool
