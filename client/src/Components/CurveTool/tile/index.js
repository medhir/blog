import React from 'react'
import { DescribePolarArc } from './arc'
import { Directions, StatefulMover } from './utils'
import { Rules } from './rules'

const DistanceCartesian = radius => {
  return Math.sqrt(Math.pow(radius, 2) / 2)
}

/**
 * Tile generates a directional, arced peano curve svg path.
 * @param {Object} props
 * @param {Number} props.radius
 * @param {Object} props.start
 * @param {String} props.diagonal
 * @param {String} props.direction
 * @param {Number} props.strokeWidth
 */
const Tile = ({ radius, start, diagonal, direction, strokeWidth }) => {
  const RadiusInCartesian = DistanceCartesian(radius)
  const MoveDistance = DistanceCartesian(radius) * 2
  let mover = StatefulMover(start)
  let d = ''

  // randomize curve orientation
  let coinFlip = Math.random()
  let rule
  if (coinFlip > 0.5) {
    rule = Rules[diagonal].Horizontal
  } else {
    rule = Rules[diagonal].Vertical
  }
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

export default Tile
