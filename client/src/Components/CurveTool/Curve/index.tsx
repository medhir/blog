import React, { Component } from 'react'
import { Point, Rule } from './types'

export interface CurveProps {
  cellSize: number
  className: string
  points: Point[]
  rules: Rule[]
  gridSize: number
  visible: boolean
}

export interface CurveState {
  fillMatrix: boolean[][]
  validMatrix: boolean[][]
}

class Curve extends Component<CurveProps, CurveState> {
  constructor(props) {
    super(props)
  }
  componentDidMount() {}
}
