import React from 'react'
import { StatefulMover } from '../../../utils'
import { Arc, Directions } from '../../../arc'

const VerticalRightward = ({ radius, origin }) => {
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

  return <g>{arcs}</g>
}

export default VerticalRightward
