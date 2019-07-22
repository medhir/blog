import React from 'react'
import { PeanoCurves } from './peano'

import './index.css'
import { Arc, Directions } from './arc'

class CurveTool extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <section className="curveTool">
        <h2>curve.tool</h2>
        <p>
          vector-based space filling curve generator for stretchable electrode
          patterning.
        </p>
        <svg className="headerVector">
          <PeanoCurves.Vertical flipped origin={{ x: 30, y: 30 }} size={40} />
          <Arc
            start={{ x: 30, y: 50 }}
            radius={10}
            direction={Directions.RightDown}
          />
          <PeanoCurves.Horizontal flipped origin={{ x: 60, y: 60 }} size={40} />
          <Arc
            start={{ x: 80, y: 60 }}
            radius={10}
            direction={Directions.RightDownSweep}
          />
          <PeanoCurves.Vertical origin={{ x: 90, y: 90 }} size={40} />
          <Arc
            start={{ x: 90, y: 110 }}
            radius={10}
            direction={Directions.LeftDownSweep}
          />
          <PeanoCurves.Horizontal
            flipped
            origin={{ x: 60, y: 120 }}
            size={40}
          />
          <Arc
            start={{ x: 90, y: 110 }}
            radius={10}
            direction={Directions.LeftDownSweep}
          />
          <PeanoCurves.Vertical origin={{ x: 30, y: 90 }} size={40} />
        </svg>

        <h3>Tile-based Interface</h3>
        <p>
          Tile primitives that scale / connect seamlessly. Randomize orientation
          on a path to minimize strain for the entire electrode system.
        </p>
      </section>
    )
  }
}

export default CurveTool
