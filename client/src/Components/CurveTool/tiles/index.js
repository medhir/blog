import React from 'react'
import { DescribePolarArc } from '../arc'
import { Directions, StatefulMover } from '../utils'
import { Rules } from './rules'

const DistanceCartesian = radius => {
  return Math.sqrt(Math.pow(radius, 2) / 2)
}

export const Tile = ({
  radius,
  start,
  rule,
  direction,
  mover,
  strokeWidth,
}) => {
  const MoveDistance = DistanceCartesian(radius) * 2
  // init mover if not one provided
  if (!mover) {
    mover = StatefulMover(start)
  }
  let d = ''

  const ProcessRule = rule => {
    for (let i = 0; i < rule.length; i++) {
      if (rule[i].angles) {
        // Draw arc
        d += DescribePolarArc(
          mover.Cursor(),
          radius,
          rule[i].angles[0],
          rule[i].angles[1]
        )
      }
      if (rule[i].direction) {
        // Move cursor
        mover.Move(MoveDistance, rule[i].direction)
      }
    }
  }

  let commonRule = rule.common
  ProcessRule(commonRule)
  if (direction) {
    const connectorRule = rule.connector[direction]
    ProcessRule(connectorRule)
  }

  return (
    <path
      stroke="black"
      strokeWidth={strokeWidth ? strokeWidth : '4'}
      fill="transparent"
      d={d}
    />
  )
}

// Manual tile generator
// TODO: Automate
export const Curve0 = ({ radius, start, strokeWidth }) => {
  const MoveDistance = DistanceCartesian(radius) * 2
  const paths = []
  const mover = StatefulMover(start)
  paths.push(
    <Tile
      start={mover.Cursor()}
      radius={radius}
      rule={Rules.RightUp.Vertical}
      direction={Directions.Right}
      mover={mover}
      strokeWidth={strokeWidth}
    />
  )
  paths.push(
    <Tile
      start={mover.Cursor()}
      radius={radius}
      rule={Rules.RightDown.Horizontal}
      mover={mover}
      strokeWidth={strokeWidth}
    />
  )

  return <g>{paths}</g>
}
