import React from 'react'
import { Directions } from 'Components/CurveTool/tile/utils'
import Tile from 'Components/CurveTool/tile'

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
 * GetDirection returns the directions given two points
 * @param {Object} point1
 * @param {Object} point2
 */
export const GetDirection = (point1, point2) => {
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
  const points = line.slice().reverse()
  const initialSize = Number(line.length)
  if (initialSize === 0 || initialSize === 1) {
    return null
  }

  const generateRules = (tileRules, line) => {
    // get first tile rule
    const initialRule = tileRules[0]
    if (!initialRule) {
      return
    }
    while (tileRules.length !== line.length) {
      const previousRule = tileRules[tileRules.length - 1]
      const { diagonal } = previousRule
      const point1 = Object.assign({}, line[line.length - tileRules.length])
      const point2 = Object.assign({}, line[line.length - 1 - tileRules.length])
      const direction = GetDirection(point1, point2)
      const nextDiagonal = NextDiagonalDirection[diagonal][direction]
      if (nextDiagonal) {
        previousRule.direction = direction
        tileRules.push({
          diagonal: nextDiagonal,
          direction: direction,
        })
      } else {
        return null
      }
    }
    return tileRules
  }

  const point1 = Object.assign({}, points[points.length - 1])
  const point2 = Object.assign({}, points[points.length - 2])
  const direction = GetDirection(point1, point2)
  const potentialDiagonals = PotentialDiagonalDirections[direction]
  const potentialRules = [
    generateRules(
      [
        {
          diagonal: potentialDiagonals[0],
          direction: direction,
        },
      ],
      points
    ),
    generateRules(
      [
        {
          diagonal: potentialDiagonals[1],
          direction: direction,
        },
      ],
      points
    ),
  ]
  if (potentialRules[0]) return potentialRules[0]
  else return potentialRules[1]
}

const DistanceCartesian = radius => {
  return Math.sqrt(Math.pow(radius, 2) / 2)
}

/**
 * Tiles returns SVG paths for a given set of rules for a line
 * @param {Object} props
 * @param {Array} props.rules
 * @param {Array} props.line
 * @param {Number} props.cellSize
 * @param {Number} props.strokeWidth
 */
export const Tiles = ({ rules, line, cellSize, strokeWidth }) => {
  return (
    <g>
      {rules.map((rule, i) => (
        <Tile
          radius={DistanceCartesian(cellSize / 3)}
          start={{
            x: line[i].svgX + cellSize / 2,
            y: line[i].svgY + cellSize / 2,
          }}
          diagonal={rule.diagonal}
          direction={rule.direction}
          strokeWidth={strokeWidth}
          key={`curve-${i}`}
        />
      ))}
    </g>
  )
}
