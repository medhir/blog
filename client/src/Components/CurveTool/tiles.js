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
  LeftDownHorizontal: 6,
  LeftDownVertical: 7,
}

const GetRulesForTile = tile => {
  switch (tile) {
    case Tiles.RightUpHorizontal:
      return Rules.RightUpHorizontal
    case Tiles.RightUpVertical:
      return Rules.RightUpVertical
    case Tiles.LeftUpHorizontal:
      return Rules.LeftUpHorizontal
    case Tiles.LeftUpVertical:
      return Rules.LeftUpVertical
    case Tiles.RightDownHorizontal:
      return Rules.RightDownHorizontal
    case Tiles.RightDownVertical:
      return Rules.RightDownVertical
    case Tiles.LeftDownHorizontal:
      return Rules.LeftDownHorizontal
    case Tiles.LeftDownVertical:
      return Rules.LeftDownVertical
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
  RightUpVertical: [
    {
      angles: [45, 135],
      direction: Directions.RightUp,
    },
    {
      angles: [-135, 135],
      direction: Directions.RightDown,
    },
    {
      angles: [45, 315],
      direction: Directions.RightUp,
    },
    {
      angles: [225, 315],
      direction: Directions.LeftUp,
    },
    {
      angles: [45, 135],
      direction: null,
    },
  ],
  LeftUpHorizontal: [
    {
      angles: [-45, 45],
      direction: Directions.LeftUp,
    },
    {
      angles: [-225, 45],
      direction: Directions.RightUp,
    },
    {
      angles: [-45, 225],
      direction: Directions.LeftUp,
    },
    {
      angles: [135, 315],
    },
  ],
  LeftUpVertical: [
    {
      angles: [225, 315],
      direction: Directions.LeftUp,
    },
    {
      angles: [-135, 135],
      direction: Directions.LeftDown,
    },
    {
      angles: [45, 315],
      direction: Directions.LeftUp,
    },
    {
      angles: [45, 135],
      direction: Directions.RightUp,
    },
    {
      angles: [225, 315],
    },
  ],
  RightDownHorizontal: [
    {
      angles: [135, 225],
      direction: Directions.RightDown,
    },
    {
      angles: [-45, 225],
      direction: Directions.LeftDown,
    },
    {
      angles: [-225, 45],
      direction: Directions.RightDown,
    },
    {
      angles: [-45, 135],
      direction: null,
    },
  ],
  RightDownVertical: [
    {
      angles: [45, 135],
      direction: Directions.RightDown,
    },
    {
      angles: [45, 315],
      direction: Directions.RightUp,
    },
    {
      angles: [-135, 135],
      direction: Directions.RightDown,
    },
    {
      angles: [135, 315],
      direction: null,
    },
  ],
  LeftDownHorizontal: [
    {
      angles: [135, 225],
      direction: Directions.LeftDown,
    },
    {
      angles: [-225, 45],
      direction: Directions.RightDown,
    },
    {
      angles: [-45, 225],
      direction: Directions.LeftDown,
    },
    {
      angles: [-135, 45],
      direction: null,
    },
  ],
  LeftDownVertical: [
    {
      angles: [225, 315],
      direction: Directions.LeftDown,
    },
    {
      angles: [45, 315],
      direction: Directions.LeftUp,
    },
    {
      angles: [-135, 135],
      direction: Directions.LeftDown,
    },
    {
      angles: [45, 135],
      direction: Directions.RightDown,
    },
    {
      angles: [225, 315],
      direction: null,
    },
  ],
}

export const TilePath = ({ radius, start, tile, mover }) => {
  const MoveDistance = DistanceCartesian(radius) * 2
  if (!mover) {
    mover = StatefulMover(start)
  }
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
