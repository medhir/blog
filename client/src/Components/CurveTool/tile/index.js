import React from 'react'
import { DescribePolarArc } from './arc'
import { StatefulMover } from './utils'
import { Rules } from './rules'

const DistanceCartesian = radius => {
  return Math.sqrt(Math.pow(radius, 2) / 2)
}

/**
 * DescribePath generates the description for an SVG path representing the Peano curve
 * @param {Number} radius radius of the arc sections
 * @param {Object} start  x, y coordinates to start the path
 * @param {Number} start.x
 * @param {Number} start.y
 * @param {Object} diagonal diagonal description for the curve
 * @param {String} direction direction of the connector for the next curve
 * @param {String|Null} orientation whether to draw horizontally or vertically
 */
export const DescribePath = (
  radius,
  start,
  diagonal,
  direction,
  orientation
) => {
  const RadiusInCartesian = DistanceCartesian(radius)
  const MoveDistance = DistanceCartesian(radius) * 2
  let mover = StatefulMover(start)
  let d = ''

  let rule
  if (!orientation) {
    // randomize curve orientation
    let coinFlip = Math.random()
    if (coinFlip > 0.5) {
      rule = Rules[diagonal].Horizontal
    } else {
      rule = Rules[diagonal].Vertical
    }
  } else {
    rule = Rules[diagonal][orientation]
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
  return d
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
  const d = DescribePath(radius, start, diagonal, direction, null)
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
