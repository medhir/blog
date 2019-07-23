import React from 'react'

import { Tiles, TilePath } from './tiles'

import './index.css'

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
          <TilePath
            start={{
              x: 100,
              y: 100,
            }}
            radius={10}
            tile={Tiles.RightUpHorizontal}
          />
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
