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
 * PotentialDirections describes the potential diagonal directions a tile can take,
 * given a horizontal or vertical direction
 */
const PotentialDirections = {
  Up: [Directions.RightUp, Directions.LeftUp],
  Down: [Directions.RightDown, Directions.LeftDown],
  Right: [Directions.RightUp, Directions.RightDown],
  Left: [Directions.LeftUp, Directions.LeftDown],
}

/**
 * Tiles generates peano curve tiles for a continuous line
 * @param {Object} props
 * @param {Array} props.line r
 */
export const Tiles = ({ line }) => {
  const lineCopy = line.slice()
  const processedLineStack = []
  const tileRules = []
  // while (tileRules.length !== line.length) {
  // }
}
