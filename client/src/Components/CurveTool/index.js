import React from 'react'
import { RightUpArcedPeanoCurve } from './peano'
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
          <RightUpArcedPeanoCurve size={200} />
          {/* <path
            stroke="black"
            strokeWidth="5"
            fill="transparent"
            d="M 100 100 A 100 100 0 0 1 90"
          />
          <path
            stroke="red"
            strokeWidth="5"
            fill="transparent"
            d="M 75 75 A 25 25 0 1 0 100 50"
          />
          <path
            stroke="black"
            strokeWidth="5"
            fill="transparent"
            d="M 100 50 A 25 25 0 1 1 125 25"
          />
          <path
            stroke="red"
            strokeWidth="5"
            fill="transparent"
            d="M 125 25 A 25 25 0 0 0 150 50"
          /> */}
        </svg>
      </section>
    )
  }
}

export default CurveTool
