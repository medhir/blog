import { Point } from 'Components/CurveTool/Curve/types'

export const PolarToCartesian = (
  center: Point,
  radius: number,
  angleInDegrees: number
) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0

  return {
    x: center.x + radius * Math.cos(angleInRadians),
    y: center.y + radius * Math.sin(angleInRadians),
  }
}

export const DescribePolarArc = (
  center: Point,
  radius: number,
  startAngle: number,
  endAngle: number
) => {
  const start = PolarToCartesian(center, radius, endAngle)
  const end = PolarToCartesian(center, radius, startAngle)

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

/**
 * GenerateArc creates an SVG path definition for the arc. The size of the arc is specified by the radius.
 * The largeArc and sweep flags determine the type of arc that is drawn between start and end.
 * @param {object} start Start (x, y) coordinates
 * @param {object} end End (x, y) coordinates
 * @param {number} radius Radius of the arc
 * @param {boolean} largeArc Large part of arc drawn between start and end.
 * @param {boolean} sweep Direction of arc.
 */
export const GenerateArc = (
  start: Point,
  end: Point,
  radius: number,
  largeArc: boolean,
  sweep: boolean
) => {
  return `M ${start.x} ${start.y} A ${radius} ${radius}, 0, ${
    largeArc ? '1' : '0'
  }, ${sweep ? '1' : '0'}, ${end.x} ${end.y} `
}
