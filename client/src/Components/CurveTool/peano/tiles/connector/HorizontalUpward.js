import React from 'react'
import { StatefulMover } from '../../../utils'
import { Arc, Directions } from '../../../arc'

const HorizontalUpward = ({ radius, origin }) => {
  const statefulMover = StatefulMover(origin)
  const arcs = []

  arcs.push(
    <Arc
      start={statefulMover.Cursor()}
      radius={radius}
      direction={Directions.RightUp}
    />
  )
  statefulMover.RightUp(radius)

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
      direction={Directions.LeftUpSweep}
    />
  )
  statefulMover.LeftUp(radius)

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
      direction={Directions.RightDown}
    />
  )
  statefulMover.RightDown(radius)

  return <g>{arcs}</g>
}

export default HorizontalUpward
