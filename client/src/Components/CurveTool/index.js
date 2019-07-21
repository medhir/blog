import React from 'react'
import { PeanoCurves } from './peano'
import './index.css'

class CurveTool extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <section className="curveTool">
        <h2>curve.tool</h2>
        <svg>
          <PeanoCurves.RightDown size={100} origin={{ x: 0, y: 75 }} />
          <PeanoCurves.RightUp size={200} origin={{ x: 50, y: 75 }} />
          <PeanoCurves.RightDown size={200} origin={{ x: 150, y: 75 }} />
          <PeanoCurves.RightUp size={100} origin={{ x: 250, y: 75 }} />
          <PeanoCurves.RightDown size={200} origin={{ x: 300, y: 75 }} />
          <PeanoCurves.RightUp size={150} origin={{ x: 400, y: 75 }} />
        </svg>
        <p>
          open source space-filling curve generator for stretchable electrode
          patterning.
        </p>
      </section>
    )
  }
}

export default CurveTool
