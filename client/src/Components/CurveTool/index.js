import React from 'react'

import { Curve0, Tiles, TilePath } from './tiles'

import './index.css'

class CurveTool extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      strokeWidth: 0,
    }
  }

  componentDidMount() {
    const intervalId = setInterval(this.updateRadius.bind(this), 10)
  }

  updateRadius() {
    const time = Date.now()
    this.setState({
      strokeWidth: 1 + Math.abs(Math.sin(time / 3000) * 5),
    })
  }

  render() {
    const { strokeWidth } = this.state
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
          <Curve0
            radius={10}
            strokeWidth={strokeWidth}
            start={{ x: 25, y: 200 }}
          />
          <Curve0
            radius={10}
            strokeWidth={strokeWidth}
            start={{ x: 75, y: 200 }}
          />
          <Curve0
            radius={10}
            strokeWidth={strokeWidth}
            start={{ x: 125, y: 200 }}
          />
          <Curve0
            radius={10}
            strokeWidth={strokeWidth}
            start={{ x: 175, y: 200 }}
          />
        </svg>
      </section>
    )
  }
}

export default CurveTool
