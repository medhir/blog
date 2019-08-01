import React from 'react'
import { Mover, GenerateArcPath } from './utils'

const PolarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
}

export const DescribePolarArc = (center, radius, startAngle, endAngle) => {
  const start = PolarToCartesian(center.x, center.y, radius, endAngle)
  const end = PolarToCartesian(center.x, center.y, radius, startAngle)

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

  const d = [
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
