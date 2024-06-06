//@ts-nocheck
import {
  Directions,
  NextDiagonalDirection,
} from '@/components/CurveTool/Direction'
import { Rule, Point } from '@/components/CurveTool/Grid/types'
import {GridDimensions} from "@/components/CurveTool/Curves";

/**
 * Matrix generates a matrix for grid metadata
 * @param dimensions
 * @param initialValue
 */
export const Matrix = (
  dimensions: GridDimensions,
  initialValue: boolean = true
): boolean[][] => {
  const grid: boolean[][] = []
  for (let i = 0; i < dimensions.width; i++) {
    const row: boolean[] = []
    for (let j = 0; j < dimensions.height; j++) {
      row.push(initialValue)
    }
    grid.push(row)
  }
  return grid
}

/**
 * ValidMatrix returns points on the grid that are valid to extend the curve
 * @param dimensions
 * @param rules
 * @param points
 * @param fillMatrix
 */
export const ValidMatrix = (
  dimensions: GridDimensions,
  rules: Rule[],
  points: Point[],
  fillMatrix: boolean[][]
): boolean[][] => {
  if (points.length < 1) return Matrix(dimensions, true)
  const { x, y } = points[points.length - 1]
  let prevDiagonal
  if (rules.length > 1) {
    prevDiagonal = rules[rules.length - 1].diagonal
  }
  const validMatrix = Matrix(dimensions, false)
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
  if (x + 1 < dimensions.width && !fillMatrix[x + 1][y]) {
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
  if (y + 1 < dimensions.height && !fillMatrix[x][y + 1]) {
    validMatrix[x][y + 1] = true
    if (prevDiagonal && !NextDiagonalDirection[prevDiagonal][Directions.Down]) {
      validMatrix[x][y + 1] = false
    }
  }
  return validMatrix
}
