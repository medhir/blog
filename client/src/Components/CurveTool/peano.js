import React from 'react'

const Move = radius => ({
  Right: cursor => ({
    x: cursor.x + radius,
    y: cursor.y,
  }),
  RightDown: cursor => ({
    x: cursor.x + radius,
    y: cursor.y + radius,
  }),
  RightUp: cursor => ({
    x: cursor.x + radius,
    y: cursor.y - radius,
  }),
  Left: cursor => ({
    x: cursor.x - radius,
    y: cursor.y,
  }),
  LeftDown: cursor => ({
    x: cursor.x - radius,
    y: cursor.y + radius,
  }),
  LeftUp: cursor => ({
    x: cursor.x - radius,
    y: cursor.y - radius,
  }),
  Up: cursor => ({
    x: cursor.x,
    y: cursor.y - radius,
  }),
  Down: cursor => ({
    x: cursor.x,
    y: cursor.y + radius,
  }),
})

const generateBoundingSquare = size => {
  return {
    TopLeft: {
      x: 0,
      y: 0,
    },
    TopRight: {
      x: size,
      y: 0,
    },
    BottomLeft: {
      x: 0,
      y: size,
    },
    BottomRight: {
      x: size,
      y: size,
    },
  }
}
const generateArcSegment = (start, end, radius, largeArc, sweep) => {
  return `M ${start.x} ${start.y} A ${radius} ${radius}, 0, ${
    largeArc ? '1' : '0'
  }, ${sweep ? '1' : '0'}, ${end.x} ${end.y}`
}

export const RightUpArcedPeanoCurve = ({ size }) => {
  const radius = size / 8
  const BoundingSquare = generateBoundingSquare(size)
  const Mover = Move(radius)

  let cursor = BoundingSquare.BottomLeft
  let d = ''
  // move right up
  let moved = Mover.RightUp(cursor)
  d += generateArcSegment(cursor, moved, radius, false, false) + ' '
  cursor = moved
  // move right up again
  moved = Mover.RightUp(cursor)
  d += generateArcSegment(cursor, moved, radius, false, true) + ' '
  cursor = moved
  // move right down
  moved = Mover.RightDown(cursor)
  d += generateArcSegment(cursor, moved, radius, false, true) + ' '
  // move left down
  cursor = moved
  moved = Mover.LeftDown(cursor)
  d += generateArcSegment(cursor, moved, radius, false, true) + ' '
  // move left down again
  cursor = moved
  moved = Mover.LeftDown(cursor)
  d += generateArcSegment(cursor, moved, radius, false, false)
  return <path stroke="black" strokeWidth="3" fill="transparent" d={d} />
}

export const RightDownPeanoCurve = ({ size }) => {
  const radius = size / 8
  const BoundingSquare = generateBoundingSquare(size)
  const Mover = Move(radius)

  let cursor = BoundingSquare.BottomLeft
  let d = ''
  // move right up
  let moved = Mover.RightUp(cursor)
  d += generateArcSegment(cursor, moved, radius, false, false) + ' '
  cursor = moved
  // move right up again
  moved = Mover.RightUp(cursor)
  d += generateArcSegment(cursor, moved, radius, false, true) + ' '
  cursor = moved
  // move right down
  moved = Mover.RightDown(cursor)
  d += generateArcSegment(cursor, moved, radius, false, true) + ' '
  // move left down
  cursor = moved
  moved = Mover.LeftDown(cursor)
  d += generateArcSegment(cursor, moved, radius, false, true) + ' '
  // move left down again
  cursor = moved
  moved = Mover.LeftDown(cursor)
  d += generateArcSegment(cursor, moved, radius, false, false)
  return <path stroke="black" strokeWidth="3" fill="transparent" d={d} />
}
