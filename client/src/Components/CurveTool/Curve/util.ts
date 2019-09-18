import { Directions } from 'Components/CurveTool/tile/utils'
import { CurveProps } from './index'

/**
 * Matrix generates a matrix for grid metadata
 * @param {number} size size of the grid
 */
const Matrix = (size: number, initialValue: boolean = true): boolean[][] => {
  const grid: boolean[][] = []
  for (let i = 0; i < size; i++) {
    const row: boolean[] = []
    for (let j = 0; j < size; j++) {
      row.push(initialValue)
    }
    grid.push(row)
  }
  return grid
}

/**
 * PotentialDiagonalDirections describes the potential diagonal directions a tile can take,
 * given a horizontal or vertical direction
 */
export const PotentialDiagonalDirections = {
  Up: [Directions.RightUp, Directions.LeftUp],
  Down: [Directions.RightDown, Directions.LeftDown],
  Right: [Directions.RightUp, Directions.RightDown],
  Left: [Directions.LeftUp, Directions.LeftDown],
}

export const NextDiagonalDirection = {
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
 * ValidMatrix returns points on the grid that are valid to extend the curve
 * @param curveProps
 * @param fillMatrix
 */
export const ValidMatrix = (
  { gridSize, rules, points }: CurveProps,
  fillMatrix: boolean[][]
): boolean[][] => {
  if (rules.length < 1 || points.length < 1) return Matrix(gridSize, true)
  const { x, y } = points[points.length - 1]
  const prevDiagonal = rules[rules.length - 1].diagonal
  const validMatrix = Matrix(gridSize, false)
  // check left
  if (
    x - 1 > -1 && // grid boundary
    !fillMatrix[x - 1][y] // not filled
  ) {
    validMatrix[x - 1][y] = true
    if (
      rules &&
      prevDiagonal &&
      !NextDiagonalDirection[prevDiagonal][Directions.Left]
    ) {
      // if not a valid path for rules, set to not valid
      validMatrix[x - 1][y] = false
    }
  }
  // check right
  if (x + 1 < gridSize && !fillMatrix[x + 1][y]) {
    validMatrix[x + 1][y] = true
    if (
      rules &&
      prevDiagonal &&
      !NextDiagonalDirection[prevDiagonal][Directions.Right]
    ) {
      validMatrix[x + 1][y] = false
    }
  }
  // check top
  if (y - 1 > -1 && !fillMatrix[x][y - 1]) {
    validMatrix[x][y - 1] = true
    if (
      rules &&
      prevDiagonal &&
      !NextDiagonalDirection[prevDiagonal][Directions.Up]
    ) {
      validMatrix[x][y - 1] = false
    }
  }
  // check bottom
  if (y + 1 < gridSize && !fillMatrix[x][y + 1]) {
    validMatrix[x][y + 1] = true
    if (
      rules &&
      prevDiagonal &&
      !NextDiagonalDirection[prevDiagonal][Directions.Down]
    ) {
      validMatrix[x][y + 1] = false
    }
  }
  return validMatrix
}
