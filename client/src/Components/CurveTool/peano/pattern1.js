import React from 'react'
import { PeanoCurves } from './index'
import { Arc, Directions } from '../arc'
import { Mover, StatefulMover } from '../utils'

// Randomize orientation of tiles
const GetRandomFlipped = () => Math.round(Math.random())

const Pattern1 = ({ tileSize, start, random }) => {
  const radius = tileSize / 4
  const tileDist = radius * 3
  const connectorMover = Mover(tileSize / 2)
  let cursor = StatefulMover(start)
  const arcs = []

  arcs.push(
    <PeanoCurves.Horizontal
      flipped={GetRandomFlipped()}
      size={tileSize}
      origin={cursor.Cursor()}
    />
  )

  arcs.push(
    <Arc
      start={connectorMover.Left(cursor.Cursor())}
      radius={radius}
      direction={Directions.LeftDown}
    />
  )

  cursor.LeftDown(tileDist)
  arcs.push(
    <PeanoCurves.Vertical
      flipped={GetRandomFlipped()}
      size={tileSize}
      origin={cursor.Cursor()}
    />
  )

  arcs.push(
    <Arc
      start={connectorMover.Down(cursor.Cursor())}
      radius={radius}
      direction={Directions.LeftDownSweep}
    />
  )

  cursor.LeftDown(tileDist)
  arcs.push(
    <PeanoCurves.Horizontal
      flipped={GetRandomFlipped()}
      size={tileSize}
      origin={cursor.Cursor()}
    />
  )

  return <g>{arcs}</g>
}

export default Pattern1
