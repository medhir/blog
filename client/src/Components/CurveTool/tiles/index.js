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
  mover,
  strokeWidth,
  connector,
}) => {
  const MoveDistance = DistanceCartesian(radius) * 2
  if (!mover) {
    mover = StatefulMover(start)
  }
  let d = ''
  let commonRule = rule.common
  for (let i = 0; i < commonRule.length; i++) {
    // Draw arc
    d += DescribePolarArc(
      mover.Cursor(),
      radius,
      commonRule[i].angles[0],
      commonRule[i].angles[1]
    )
    // Move cursor
    mover.Move(MoveDistance, commonRule[i].direction)
  }
  if (connector) {
    const connectorRule = rule.connectors[connector]
    for (let i = 0; i < connectorRule.length; i++) {
      d += DescribePolarArc(
        mover.Cursor(),
        radius,
        connectorRule[i].angles[0],
        connectorRule[i].angles[1]
      )
      if (connectorRule[i].direction) {
        // Move cursor
        mover.Move(MoveDistance, connectorRule[i].direction)
      }
    }
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
    <TilePath
      start={mover.Cursor()}
      radius={radius}
      tile={Tiles.RightUpHorizontal}
      mover={mover}
      strokeWidth={strokeWidth}
    />
  )
  paths.push(
    <TilePath
      start={mover.Cursor()}
      radius={radius}
      tile={Tiles.LeftUpVertical}
      mover={mover}
      strokeWidth={strokeWidth}
    />
  )
  paths.push(
    <TilePath
      start={mover.Cursor()}
      radius={radius}
      tile={Tiles.RightUpVertical}
      mover={mover}
      strokeWidth={strokeWidth}
    />
  )
  paths.push(
    <TilePath
      start={mover.Cursor()}
      radius={radius}
      tile={Tiles.LeftUpHorizontal}
      mover={mover}
      strokeWidth={strokeWidth}
    />
  )

  return <g>{paths}</g>
}
