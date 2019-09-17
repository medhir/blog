import React from 'react'
import Lines from './lines'

import './index.css'

class CurveTool extends React.PureComponent {
  render() {
    return (
      <section className="curveTool">
        <h2>curvetool</h2>
        <p>curvy space filling vector generator for electrode patterning.</p>
        <p>
          Tile primitives can scale + connect seamlessly. Orientation on a path
          is randomized to minimize strain on electrode wires.
        </p>
        <p>Click any two adjacent squares to start the curve.</p>
        <Lines />
      </section>
    )
  }
}

export default CurveTool
