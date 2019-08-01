import React from 'react'
import { DescribePolarArc } from './arc'
import { Directions, StatefulMover } from './utils'
import { Rules } from './rules'

const DistanceCartesian = radius => {
  return Math.sqrt(Math.pow(radius, 2) / 2)
}

const Tile = ({ radius, start, rule, direction, strokeWidth }) => {
  const RadiusInCartesian = DistanceCartesian(radius)
  const MoveDistance = DistanceCartesian(radius) * 2
  let mover = StatefulMover(start)
  let d = ''

  const ProcessRule = rule => {
    for (let i = 0; i < rule.length; i++) {
      // draw arc if angles provided
      if (rule[i].angles) {
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
    <path
      stroke="black"
      strokeWidth={strokeWidth ? strokeWidth : '4'}
      fill="transparent"
      d={d}
    />
  )
}

export const SampleCurve = ({ radius, start, strokeWidth }) => {
  const MoveDistance = DistanceCartesian(radius) * 2
  const paths = []
  paths.push(
    <Tile
      start={start}
      radius={radius}
      rule={Rules.RightDown.Vertical}
      direction={Directions.Right}
      strokeWidth={strokeWidth}
    />
  )
  paths.push(
    <Tile
      start={{
        x: start.x + DistanceCartesian(radius) * 6,
        y: start.y,
      }}
      radius={radius}
      rule={Rules.RightUp.Horizontal}
      direction={Directions.Right}
      strokeWidth={strokeWidth}
    />
  )
  paths.push(
    <Tile
      start={{
        x: start.x + DistanceCartesian(radius) * 12,
        y: start.y,
      }}
      radius={radius}
      rule={Rules.RightDown.Vertical}
      direction={Directions.Down}
      strokeWidth={strokeWidth}
    />
  )
  paths.push(
    <Tile
      start={{
        x: start.x + DistanceCartesian(radius) * 12,
        y: start.y + DistanceCartesian(radius) * 6,
      }}
      radius={radius}
      rule={Rules.LeftDown.Horizontal}
      direction={Directions.Left}
      strokeWidth={strokeWidth}
    />
  )
  paths.push(
    <Tile
      start={{
        x: start.x + DistanceCartesian(radius) * 6,
        y: start.y + DistanceCartesian(radius) * 6,
      }}
      radius={radius}
      rule={Rules.LeftUp.Vertical}
      direction={Directions.Left}
      strokeWidth={strokeWidth}
    />
  )
  paths.push(
    <Tile
      start={{
        x: start.x,
        y: start.y + DistanceCartesian(radius) * 6,
      }}
      radius={radius}
      rule={Rules.LeftDown.Horizontal}
      direction={Directions.Down}
      strokeWidth={strokeWidth}
    />
  )
  paths.push(
    <Tile
      start={{
        x: start.x,
        y: start.y + DistanceCartesian(radius) * 12,
      }}
      radius={radius}
      rule={Rules.RightDown.Vertical}
      direction={Directions.Right}
      strokeWidth={strokeWidth}
    />
  )
  paths.push(
    <Tile
      start={{
        x: start.x + DistanceCartesian(radius) * 6,
        y: start.y + DistanceCartesian(radius) * 12,
      }}
      radius={radius}
      rule={Rules.RightUp.Horizontal}
      direction={Directions.Right}
      strokeWidth={strokeWidth}
    />
  )

  paths.push(
    <Tile
      start={{
        x: start.x + DistanceCartesian(radius) * 12,
        y: start.y + DistanceCartesian(radius) * 12,
      }}
      radius={radius}
      rule={Rules.RightDown.Vertical}
      strokeWidth={strokeWidth}
    />
  )

  return <g>{paths}</g>
}

export default Tile
