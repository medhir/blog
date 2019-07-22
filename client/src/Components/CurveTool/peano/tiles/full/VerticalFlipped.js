import React from 'react'
import { StatefulMover } from '../../../utils'
import { Arc, Directions } from '../../../arc'

const VerticalFlipped = ({ size, origin }) => {
  const radius = size / 4
  const start = {
    x: origin.x,
    y: origin.y - radius * 2,
  }
  const statefulMover = StatefulMover(start)
  const arcs = []

  arcs.push(
    <Arc
      start={statefulMover.Cursor()}
      radius={radius}
      direction={Directions.RightDown}
    />
  )
  statefulMover.RightDown(radius)

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
      direction={Directions.LeftUpSweep}
    />
  )
  statefulMover.LeftUp(radius)

  arcs.push(
    <Arc
      start={statefulMover.Cursor()}
      radius={radius}
      direction={Directions.LeftUp}
    />
  )
  statefulMover.LeftUp(radius)

  arcs.push(
    <Arc
      start={statefulMover.Cursor()}
      radius={radius}
      direction={Directions.LeftDown}
    />
  )
  statefulMover.LeftDown(radius)

  arcs.push(
    <Arc
      start={statefulMover.Cursor()}
      radius={radius}
      direction={Directions.RightDown}
    />
  )
  statefulMover.RightDown(radius)

  arcs.push(
    <Arc
      start={statefulMover.Cursor()}
      radius={radius}
      direction={Directions.RightDownSweep}
    />
  )
  statefulMover.RightDown(radius)

  return (
    <g>
      <g transform={`rotate(0, ${origin.x}, ${origin.y})`}>
        {arcs}
        <circle cx={origin.x} cy={origin.y} r="3" style={{ fill: 'red' }} />
      </g>
    </g>
  )
}

export default VerticalFlipped
