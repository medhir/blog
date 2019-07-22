import React from 'react'
import { PeanoCurves } from './index'
import { Arc, Directions } from '../arc'
import { Mover, StatefulMover } from '../utils'

// Randomize orientation of tiles
const GetRandomFlipped = () => Math.round(Math.random())

const Pattern0 = ({ tileSize, start, random }) => {
  const radius = tileSize / 4
  const tileDist = radius * 3
  const connectorMover = Mover(tileSize / 2)
  let cursor = StatefulMover(start)
  const arcs = []
  arcs.push(
    <PeanoCurves.Vertical
      flipped={GetRandomFlipped()}
      size={tileSize}
      origin={cursor.Cursor()}
    />
  )

  // Add right down connector to bottom
  arcs.push(
    <Arc
      start={connectorMover.Down(cursor.Cursor())}
      radius={radius}
      direction={Directions.RightDown}
    />
  )

  cursor.RightDown(tileDist)
  arcs.push(
    <PeanoCurves.Horizontal
      flipped={GetRandomFlipped()}
      size={tileSize}
      origin={cursor.Cursor()}
    />
  )

  // Add right down connector to right
  arcs.push(
    <Arc
      start={connectorMover.Right(cursor.Cursor())}
      radius={radius}
      direction={Directions.RightDownSweep}
    />
  )

  cursor.RightDown(tileDist)
  arcs.push(
    <PeanoCurves.Vertical
      flipped={GetRandomFlipped()}
      size={tileSize}
      origin={cursor.Cursor()}
    />
  )

  // Add left down connector to bottom
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

  // Add left up connector to left
  arcs.push(
    <Arc
      start={connectorMover.Left(cursor.Cursor())}
      radius={radius}
      direction={Directions.LeftUpSweep}
    />
  )

  cursor.LeftUp(tileDist)
  arcs.push(
    <PeanoCurves.Vertical
      flipped={GetRandomFlipped()}
      size={tileSize}
      origin={cursor.Cursor()}
    />
  )

  // Add left up connector to top
  arcs.push(
    <Arc
      start={connectorMover.Up(cursor.Cursor())}
      radius={radius}
      direction={Directions.LeftUp}
    />
  )

  cursor.LeftUp(tileDist)
  arcs.push(
    <PeanoCurves.Horizontal
      flipped={GetRandomFlipped()}
      size={tileSize}
      origin={cursor.Cursor()}
    />
  )

  // Add left down connector to left
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

  // Add right down connector to bottom
  arcs.push(
    <Arc
      start={connectorMover.Down(cursor.Cursor())}
      radius={radius}
      direction={Directions.RightDown}
    />
  )

  cursor.RightDown(tileDist)
  arcs.push(
    <PeanoCurves.Horizontal
      flipped={GetRandomFlipped()}
      size={tileSize}
      origin={cursor.Cursor()}
    />
  )

  // Add right down connector to right
  arcs.push(
    <Arc
      start={connectorMover.Right(cursor.Cursor())}
      radius={radius}
      direction={Directions.RightDownSweep}
    />
  )

  cursor.RightDown(tileDist)
  arcs.push(
    <PeanoCurves.Vertical
      flipped={GetRandomFlipped()}
      size={tileSize}
      origin={cursor.Cursor()}
    />
  )

  return <g>{arcs}</g>
}

export default Pattern0
