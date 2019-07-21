import React from 'react'

const Mover = radius => ({
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

const generateArcSegment = (start, end, radius, largeArc, sweep) => {
  return `M ${start.x} ${start.y} A ${radius} ${radius}, 0, ${
    largeArc ? '1' : '0'
  }, ${sweep ? '1' : '0'}, ${end.x} ${end.y} `
}

const RightDownArcedPeanoCurve = ({ size, origin }) => {
  const radius = size / 8
  const mover = Mover(radius)

  let cursor = origin
  let d = ''

  // move right down
  let moved = mover.RightDown(cursor)
  d += generateArcSegment(cursor, moved, radius, false, true)
  // move right down again, flip direction
  cursor = moved
  moved = mover.RightDown(cursor)
  d += generateArcSegment(cursor, moved, radius, false, false)
  // move right up
  cursor = moved
  moved = mover.RightUp(cursor)
  d += generateArcSegment(cursor, moved, radius, false, false)
  // move left up
  cursor = moved
  moved = mover.LeftUp(cursor)
  d += generateArcSegment(cursor, moved, radius, false, false)
  // move left up again, flip direction
  cursor = moved
  moved = mover.LeftUp(cursor)
  d += generateArcSegment(cursor, moved, radius, false, true)
  // move right up
  cursor = moved
  moved = mover.RightUp(cursor)
  d += generateArcSegment(cursor, moved, radius, false, true)
  // move right down
  cursor = moved
  moved = mover.RightDown(cursor)
  d += generateArcSegment(cursor, moved, radius, false, true)
  // move right down again, flip direction
  cursor = moved
  moved = mover.RightDown(cursor)
  d += generateArcSegment(cursor, moved, radius, false, false)

  return <path stroke="black" strokeWidth="3" fill="transparent" d={d} />
}

const RightUpArcedPeanoCurve = ({ size, origin }) => {
  const radius = size / 8
  const mover = Mover(radius)

  let cursor = origin
  let d = ''

  // move right up
  let moved = mover.RightUp(cursor)
  d += generateArcSegment(cursor, moved, radius, false, false)
  cursor = moved
  // move right up again
  moved = mover.RightUp(cursor)
  d += generateArcSegment(cursor, moved, radius, false, true)
  cursor = moved
  // move right down
  moved = mover.RightDown(cursor)
  d += generateArcSegment(cursor, moved, radius, false, true)
  // move left down
  cursor = moved
  moved = mover.LeftDown(cursor)
  d += generateArcSegment(cursor, moved, radius, false, true)
  // move left down again
  cursor = moved
  moved = mover.LeftDown(cursor)
  d += generateArcSegment(cursor, moved, radius, false, false)
  // move right down
  cursor = moved
  moved = mover.RightDown(cursor)
  d += generateArcSegment(cursor, moved, radius, false, false)
  // move right up
  cursor = moved
  moved = mover.RightUp(cursor)
  d += generateArcSegment(cursor, moved, radius, false, false)
  // move right up
  cursor = moved
  moved = mover.RightUp(cursor)
  d += generateArcSegment(cursor, moved, radius, false, true)
  return <path stroke="black" strokeWidth="3" fill="transparent" d={d} />
}

export const PeanoCurves = {
  RightDown: props => <RightDownArcedPeanoCurve {...props} />,
  RightUp: props => <RightUpArcedPeanoCurve {...props} />,
}
