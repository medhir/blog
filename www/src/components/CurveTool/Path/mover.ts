import { Directions } from '@/components/CurveTool/Direction'
import { Point } from '@/components/CurveTool/Grid/types'

/**
 * StatefulMover holds the cursor position in memory. Calls to StatefulMover's methods return
 * the new position of the cursor. Calls to these methods are NOT idempotent as a result. Useful for tile generation.
 * @param {Point} start The (x, y) coordinates to intialize StatefulMover
 * @param {number} start.x
 * @param {number} start.y
 */
export const StatefulMover = (start: Point) => {
  let cursor = start
  return {
    Cursor: () => cursor,
    Move: (distance: number, direction: string | undefined) => {
      let newPosition
      switch (direction) {
        case Directions.Up:
          newPosition = {
            x: cursor.x,
            y: cursor.y - distance,
          }
          break
        case Directions.Down:
          newPosition = {
            x: cursor.x,
            y: cursor.y + distance,
          }
          break
        case Directions.Right:
          newPosition = {
            x: cursor.x + distance,
            y: cursor.y,
          }
          break
        case Directions.Left:
          newPosition = {
            x: cursor.x - distance,
            y: cursor.y,
          }
          break
        case Directions.RightUp:
          newPosition = {
            x: cursor.x + distance,
            y: cursor.y - distance,
          }
          break
        case Directions.RightDown:
          newPosition = {
            x: cursor.x + distance,
            y: cursor.y + distance,
          }
          break
        case Directions.LeftUp:
          newPosition = {
            x: cursor.x - distance,
            y: cursor.y - distance,
          }
          break
        case Directions.LeftDown:
          newPosition = {
            x: cursor.x - distance,
            y: cursor.y + distance,
          }
          break
        default:
          newPosition = { x: -1, y: -1 } // out of bounds point
          break
      }
      cursor = newPosition
      return newPosition
    },
  }
}
