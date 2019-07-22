/**
 * Mover is a utility that creates functions to move the cursor by the
 * specified direction.
 * @param {number} radius Arc radius
 */
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

/**
 * StatefulMover holds the cursor position in memory. Calls to StatefulMover's methods return
 * the new position of the cursor. Calls to these methods are NOT idempotent as a result. Useful for tile generation.
 * @param {object} start The (x, y) coordinates to intialize StatefulMover
 */
const StatefulMover = start => {
  let cursor = start
  return {
    Cursor: () => cursor,
    RightDown: radius => {
      const newPosition = {
        x: cursor.x + radius,
        y: cursor.y + radius,
      }
      cursor = newPosition
      return newPosition
    },
    RightUp: radius => {
      const newPosition = {
        x: cursor.x + radius,
        y: cursor.y - radius,
      }
      cursor = newPosition
      return newPosition
    },
    LeftDown: radius => {
      const newPosition = {
        x: cursor.x - radius,
        y: cursor.y + radius,
      }
      cursor = newPosition
      return newPosition
    },
    LeftUp: radius => {
      const newPosition = {
        x: cursor.x - radius,
        y: cursor.y - radius,
      }
      cursor = newPosition
      return newPosition
    },
  }
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
const GenerateArcPath = (start, end, radius, largeArc, sweep) => {
  return `M ${start.x} ${start.y} A ${radius} ${radius}, 0, ${
    largeArc ? '1' : '0'
  }, ${sweep ? '1' : '0'}, ${end.x} ${end.y} `
}

export { GenerateArcPath, Mover, StatefulMover }
