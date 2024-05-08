//@ts-nocheck
import {
  Directions,
  NextDiagonalDirection,
} from '@/components/CurveTool/Direction'
import { Rule, Point } from '@/components/CurveTool/Grid/types'

/**
 * Matrix generates a matrix for grid metadata
 * @param {number} size size of the grid
 */
export const Matrix = (
  size: number,
  initialValue: boolean = true
): boolean[][] => {
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
 * ValidMatrix returns points on the grid that are valid to extend the curve
 * @param curveProps
 * @param curveState
 */
export const ValidMatrix = (
  gridSize: number,
  rules: Rule[],
  points: Point[],
  fillMatrix: boolean[][]
): boolean[][] => {
  if (points.length < 1) return Matrix(gridSize, true)
  const { x, y } = points[points.length - 1]
  let prevDiagonal
  if (rules.length > 1) {
    prevDiagonal = rules[rules.length - 1].diagonal
  }
  const validMatrix = Matrix(gridSize, false)
  // check left
  if (
    x - 1 > -1 && // grid boundary
    !fillMatrix[x - 1][y] // not filled
  ) {
    validMatrix[x - 1][y] = true
    if (prevDiagonal && !NextDiagonalDirection[prevDiagonal][Directions.Left]) {
      // if not a valid path for rules, set to not valid
      validMatrix[x - 1][y] = false
    }
  }
  // check right
  if (x + 1 < gridSize && !fillMatrix[x + 1][y]) {
    validMatrix[x + 1][y] = true
    if (
      prevDiagonal &&
      !NextDiagonalDirection[prevDiagonal][Directions.Right]
    ) {
      validMatrix[x + 1][y] = false
    }
  }
  // check top
  if (y - 1 > -1 && !fillMatrix[x][y - 1]) {
    validMatrix[x][y - 1] = true
    if (prevDiagonal && !NextDiagonalDirection[prevDiagonal][Directions.Up]) {
      validMatrix[x][y - 1] = false
    }
  }
  // check bottom
  if (y + 1 < gridSize && !fillMatrix[x][y + 1]) {
    validMatrix[x][y + 1] = true
    if (prevDiagonal && !NextDiagonalDirection[prevDiagonal][Directions.Down]) {
      validMatrix[x][y + 1] = false
    }
  }
  return validMatrix
}
