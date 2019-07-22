import React from 'react'
import { StatefulMover } from '../../../utils'
import { Arc, Directions } from '../../../arc'

const HorizontalDownward = ({ size, origin }) => {
  const radius = size / 4
  const start = {
    x: origin.x + radius,
    y: origin.y + radius,
  }
  const rotatePoint = {
    x: origin.x + radius * 2,
    y: origin.y + radius,
  }
  const statefulMover = StatefulMover(start)
  const arcs = []
  // Add right down arc w sweep
  arcs.push(
    <Arc
      start={statefulMover.Cursor()}
      radius={radius}
      direction={Directions.RightDown}
    />
  )
  return (
    <g>
      <g transform={`rotate(0, ${rotatePoint.x}, ${rotatePoint.y})`}>
        {arcs}
        <circle cx={start.x} cy={start.y} r="2" style={{ fill: 'red' }} />
        cx={rotatePoint.x}
        cy={rotatePoint.y}
        r="3" style={{ fill: 'red' }}
        />
      </g>
    </g>
  )
}

export default HorizontalDownward
