import React from 'react'
import { DescribePolarArc } from './arc'
import { Directions, StatefulMover } from './utils'

export const Tiles = {
  RightUpHorizontal: 0,
  RightUpVertical: 1,
  LeftUpHorizontal: 2,
  LeftUpVertical: 3,
  RightDownHorizontal: 4,
  RightDownVertical: 5,
  RightUpHorizontal: 6,
  RightUpVertical: 7,
}

const GetRulesForTile = tile => {
  switch (tile) {
    case Tiles.RightUpHorizontal:
      return Rules.RightUpHorizontal
    default:
      return null
  }
}

const DistanceCartesian = radius => {
  return Math.sqrt(Math.pow(radius, 2) / 2)
}

const Rules = {
  RightUpHorizontal: [
    {
      angles: [-45, 45],
      direction: Directions.RightUp,
    },
    {
      angles: [-45, 225],
      direction: Directions.LeftUp,
    },
    {
      angles: [-225, 45],
      direction: Directions.RightUp,
    },
    {
      angles: [45, 225],
      direction: null,
    },
  ],
}

export const TilePath = ({ radius, start, tile }) => {
  const MoveDistance = DistanceCartesian(radius) * 2
  const mover = StatefulMover(start)
  const tileRules = GetRulesForTile(tile)
  let d = ''
  for (let i = 0; i < tileRules.length; i++) {
    // Draw arc
    d += DescribePolarArc(
      mover.Cursor(),
      radius,
      tileRules[i].angles[0],
      tileRules[i].angles[1]
    )
    if (i < tileRules.length - 1) {
      // Move cursor
      mover.Move(MoveDistance, tileRules[i].direction)
    }
  }
  return <path stroke="black" strokeWidth="3" fill="transparent" d={d} />
}
