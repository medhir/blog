import { Directions } from 'Components/CurveTool/tile/utils'

/**
 * EmptyMatrix generates an empty matrix to construct a grid
 * @param {Number} size size of the grid
 */
export const EmptyMatrix = size => {
  const grid = []
  for (let i = 0; i < size; i++) {
    const row = []
    for (let j = 0; j < size; j++) {
      row.push(0)
    }
    grid.push(row)
  }
  return grid
}

/**
 * PotentialDiagonalDirections describes the potential diagonal directions a tile can take,
 * given a horizontal or vertical direction
 */
const PotentialDiagonalDirections = {
  Up: [Directions.RightUp, Directions.LeftUp],
  Down: [Directions.RightDown, Directions.LeftDown],
  Right: [Directions.RightUp, Directions.RightDown],
  Left: [Directions.LeftUp, Directions.LeftDown],
}

const NextDiagonalDirection = {
  RightUp: {
    Right: Directions.RightDown,
    Up: Directions.LeftUp,
  },
  RightDown: {
    Right: Directions.RightUp,
    Down: Directions.LeftDown,
  },
  LeftUp: {
    Left: Directions.LeftDown,
    Up: Directions.RightUp,
  },
  LeftDown: {
    Left: Directions.LeftUp,
    Down: Directions.RightDown,
  },
}

/**
 * GetDirection returns the directions given two points
 * @param {Object} point1
 * @param {Object} point2
 */
const GetDirection = (point1, point2) => {
  debugger
  const dx = point2.x - point1.x
  const dy = point2.y - point1.y

  if (dx === 0 && dy === 1) {
    return Directions.Down
  } else if (dx === 0 && dy === -1) {
    return Directions.Up
  } else if (dx === 1 && dy === 0) {
    return Directions.Right
  } else if (dx === -1 && dy === 0) {
    return Directions.Left
  }
}

/**
 * TileRules generates peano curve tiles for a continuous line
 * @param {Array} line array of points representing a line
 */
export const TileRules = line => {
  const pointStack = line.slice().reverse()
  const processedPointStack = []
  const tileRules = []
  if (line.length === 0 || line.length === 1) {
    return null
  }
  while (tileRules.length !== line.length) {
    if (tileRules.length < 1) {
      const point1 = pointStack.pop()
      const point2 = Object.assign({}, pointStack[pointStack.length - 1])
      const direction = GetDirection(point1, point2)
      const potentialDiagonals = PotentialDiagonalDirections[direction]
      for (let i = 0; i < potentialDiagonals.length; i++) {
        const potentialDiagonal = potentialDiagonals[i]
        const nextDiagonal = NextDiagonalDirection[potentialDiagonal][direction]
        if (nextDiagonal) {
          tileRules.push({
            diagonal: potentialDiagonal,
            direction: direction,
          })
          processedPointStack.push(point1)
          break
        }
      }
    } else {
      const point1 = pointStack.pop()
      const point2 = Object.assign({}, pointStack[pointStack.length - 1])
      const direction = GetDirection(point1, point2)
      const previousRule = tileRules[tileRules.length - 1]
      const nextDiagonal =
        NextDiagonalDirection[previousRule.diagonal][direction]
      if (nextDiagonal) {
        tileRules.push({
          diagonal: nextDiagonal,
          direciton: direction,
        })
        processedPointStack.push(point1)
        continue
      } else {
        // if next diagonal not found, move "back" a step
        pointStack.push(processedPointStack.pop())
      }
    }
  }
  return tileRules
}
