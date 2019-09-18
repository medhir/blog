export interface Point {
  x: number
  y: number
  svgX: number
  svgY: number
}

export type Line = Point[]

export interface TileRule {
  diagonal: string
  direction: string
}

export interface LineGeneratorProps {
  cellSize: number
  className: string
  gridSize: number
  strokeWidth: number
  visible: boolean
}

export interface LineGeneratorState {
  fillMatrix: number[][]
  validMatrix?: number[][]
  line?: Line
  position: Point
  tileRules?: TileRule[]
}
