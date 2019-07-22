import React from 'react'
import { PeanoCurves } from './peano'
import Pattern0 from './peano/pattern0'

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
          <Pattern0 tileSize={40} start={{ x: 100, y: 30 }} />
          <Pattern0 tileSize={40} start={{ x: 280, y: 30 }} />
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
