import React from 'react'
import { DescribePolarArc } from '../arc'
import { Directions, StatefulMover } from '../utils'
import { Rules } from './rules'

const DistanceCartesian = radius => {
  return Math.sqrt(Math.pow(radius, 2) / 2)
}

export const Tile = ({ radius, start, rule, direction, strokeWidth }) => {
  const RadiusInCartesian = DistanceCartesian(radius)
  const MoveDistance = DistanceCartesian(radius) * 2
  let mover = StatefulMover(start)
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

  // Move cursor to path start
  let startPointRule = rule.startPoint
  for (let i = 0; i < startPointRule.length; i++) {
    mover.Move(
      RadiusInCartesian * startPointRule[i].scale,
      startPointRule[i].direction
    )
  }

  let commonRule = rule.common
  ProcessRule(commonRule)
  if (direction) {
    const connectorRule = rule.connector[direction]
    ProcessRule(connectorRule)
  }

  return (
    <g>
      <circle
        cx={start.x}
        cy={start.y}
        fill="red"
        r={strokeWidth ? strokeWidth : '4'}
      />
      <path
        stroke="black"
        strokeWidth={strokeWidth ? strokeWidth : '4'}
        fill="transparent"
        d={d}
      />
    </g>
  )
}

// Manual tile generator
// TODO: Automate
export const Curve0 = ({ radius, start, strokeWidth }) => {
  const MoveDistance = DistanceCartesian(radius) * 2
  const paths = []
  paths.push(
    <Tile
      start={start}
      radius={radius}
      rule={Rules.LeftDown.Vertical}
      direction={Directions.Down}
      strokeWidth={strokeWidth}
    />
  )

  return <g>{paths}</g>
}
