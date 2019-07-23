import React from 'react'

import { Tiles, TilePath } from './tiles'

import './index.css'

class CurveTool extends React.Component {
  render() {
    return (
      <section className="curveTool">
        <h2>curve.tool</h2>
        <p>
          vector-based space filling curve generator for stretchable electrode
          patterning.
        </p>
        <h3>Tile-based Interface</h3>
        <p>
          Tile primitives that scale / connect seamlessly. Randomize orientation
          on a path to minimize strain on electrode wires.
        </p>
        <svg className="fullHeight">
          <TilePath
            radius={10}
            start={{ x: 20, y: 20 }}
            tile={Tiles.RightDownHorizontal}
          />
          <TilePath
            radius={10}
            start={{ x: 100, y: 20 }}
            tile={Tiles.RightDownVertical}
          />
          <TilePath
            radius={10}
            start={{ x: 200, y: 20 }}
            tile={Tiles.LeftDownHorizontal}
          />
          <TilePath
            radius={10}
            start={{ x: 300, y: 20 }}
            tile={Tiles.LeftDownVertical}
          />
        </svg>
      </section>
    )
  }
}

export default CurveTool
