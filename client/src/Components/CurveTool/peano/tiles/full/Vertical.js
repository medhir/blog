import React from 'react'
import { StatefulMover } from '../../../utils'
import { Arc, Directions } from '../../../arc'

const Vertical = ({ size, origin }) => {
  const radius = size / 4
  const start = {
    x: origin.x,
    y: origin.y - radius * 2,
  }
  const statefulMover = StatefulMover(start)
  const arcs = []

  // Add left down arc w sweep
  arcs.push(
    <Arc
      start={statefulMover.Cursor()}
      radius={radius}
      direction={Directions.LeftDownSweep}
    />
  )
  statefulMover.LeftDown(radius)
  // Add left down arc
  arcs.push(
    <Arc
      start={statefulMover.Cursor()}
      radius={radius}
      direction={Directions.LeftDown}
    />
  )
  statefulMover.LeftDown(radius)
  // Add right down arc
  arcs.push(
    <Arc
      start={statefulMover.Cursor()}
      radius={radius}
      direction={Directions.RightDown}
    />
  )
  statefulMover.RightDown(radius)
  // Add right up arc
  arcs.push(
    <Arc
      start={statefulMover.Cursor()}
      radius={radius}
      direction={Directions.RightUp}
    />
  )
  statefulMover.RightUp(radius)
  // Add right up arc w sweep
  arcs.push(
    <Arc
      start={statefulMover.Cursor()}
      radius={radius}
      direction={Directions.RightUpSweep}
    />
  )
  statefulMover.RightUp(radius)

  arcs.push(
    <Arc
      start={statefulMover.Cursor()}
      radius={radius}
      direction={Directions.RightDownSweep}
    />
  )
  statefulMover.RightDown(radius)

  arcs.push(
    <Arc
      start={statefulMover.Cursor()}
      radius={radius}
      direction={Directions.LeftDownSweep}
    />
  )
  statefulMover.LeftDown(radius)

  arcs.push(
    <Arc
      start={statefulMover.Cursor()}
      radius={radius}
      direction={Directions.LeftDown}
    />
  )

  return (
    <g>
      <g transform={`rotate(0, ${origin.x}, ${origin.y})`}>
        {arcs}
        <circle cx={origin.x} cy={origin.y} r="3" style={{ fill: 'red' }} />
      </g>
    </g>
  )
}

export default Vertical
