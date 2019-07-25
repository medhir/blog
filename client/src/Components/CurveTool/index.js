import React from 'react'

import { Curve0, Tiles, TilePath } from './tiles'

import './index.css'

class CurveTool extends React.Component {
  render() {
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
        <svg className="fullHeight">
          <Curve0 radius={20} strokeWidth={7} start={{ x: 150, y: 150 }} />
        </svg>
      </section>
    )
  }
}

export default CurveTool
