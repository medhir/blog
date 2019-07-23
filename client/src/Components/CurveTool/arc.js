import React from 'react'
import { Mover, GenerateArcPath } from './utils'

const Directions = {
  RightUp: 0,
  RightUpSweep: 1,
  RightDown: 2,
  RightDownSweep: 3,
  LeftUp: 4,
  LeftUpSweep: 5,
  LeftDown: 6,
  LeftDownSweep: 7,
}

const ArcPath = ({ d }) => (
  <path stroke="black" strokeWidth="3" fill="transparent" d={d} />
)

const PolarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
}
const DescribePolarArc = (center, radius, startAngle, endAngle) => {
  var start = PolarToCartesian(center.x, center.y, radius, endAngle)
  var end = PolarToCartesian(center.x, center.y, radius, startAngle)

  var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

  var d = [
    'M',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(' ')

  return d + ' '
}

const PolarArc = ({ center, radius, startDegree, endDegree, options }) => (
  <g>
    <circle cx={center.x} cy={center.y} r="3" style={{ fill: 'red' }} />
    <path
      stroke="black"
      strokeWidth="3"
      fill="transparent"
      d={DescribePolarArc(center, radius, startDegree, endDegree)}
    />
  </g>
)

const Arc = ({ start, radius, direction }) => {
  // Create mover utility functions to determine arc end point
  const mover = Mover(radius)
  // Generate arc path according to specified direction
  let d, end
  switch (direction) {
    case Directions.RightUp:
      end = mover.RightUp(start)
      d = GenerateArcPath(start, end, radius, false, false)
      break
    case Directions.RightUpSweep:
      end = mover.RightUp(start)
      d = GenerateArcPath(start, end, radius, false, true)
      break
    case Directions.RightDown:
      end = mover.RightDown(start)
      d = GenerateArcPath(start, end, radius, false, false)
      break
    case Directions.RightDownSweep:
      end = mover.RightDown(start)
      d = GenerateArcPath(start, end, radius, false, true)
      break
    case Directions.LeftUp:
      end = mover.LeftUp(start)
      d = GenerateArcPath(start, end, radius, false, false)
      break
    case Directions.LeftUpSweep:
      end = mover.LeftUp(start)
      d = GenerateArcPath(start, end, radius, false, true)
      break
    case Directions.LeftDown:
      end = mover.LeftDown(start)
      d = GenerateArcPath(start, end, radius, false, false)
      break
    case Directions.LeftDownSweep:
      end = mover.LeftDown(start)
      d = GenerateArcPath(start, end, radius, false, true)
    default:
      break
  }
  // Create svg path
  let path = d ? <ArcPath d={d} /> : null
  return path
}

export { Arc, PolarArc, DescribePolarArc, Directions }
