import React, { Component, ChangeEvent } from 'react'
import ReactDOM from 'react-dom'
import { saveAs } from 'file-saver'
import Auth from 'Auth'
import Grid from 'Components/CurveTool/Grid'
import { Point, Rule } from 'Components/CurveTool/Grid/types'
import Controls from './controls'
import { Tiles } from 'Components/CurveTool/Path'
import './index.css'
import { Matrix, ValidMatrix } from 'Components/CurveTool/Grid/util'
import { GenerateRules } from './rule_generator'

interface CurveData {
  points: Point[]
  rules: Rule[]
  strokeWidth: number
  fillMatrix: boolean[][]
  validMatrix?: boolean[][]
}

interface CurveProps {
  gridSize: number
  cellSize?: number
}

interface CurvesState {
  cellSize: number
  curves: CurveData[]
  index: number
  gridChecked: boolean
  strokeWidth: number
}

const InitialStrokeWidth = 2
const InitialCellSize = 25

class Curves extends Component<CurveProps, CurvesState> {
  constructor(props: CurveProps) {
    super(props)
    const { cellSize, gridSize } = this.props
    this.state = {
      strokeWidth: InitialStrokeWidth,
      gridChecked: true,
      cellSize: cellSize ? cellSize : InitialCellSize,
      curves: [
        {
          points: [],
          rules: [],
          fillMatrix: Matrix(gridSize, false),
          strokeWidth: InitialStrokeWidth,
        },
      ],
      index: 0,
    }
    this.addCurve = this.addCurve.bind(this)
    this.changeCurve = this.changeCurve.bind(this)
    this.markFilled = this.markFilled.bind(this)
    this.updateStrokeWidth = this.updateStrokeWidth.bind(this)
    this.updateCellSize = this.updateCellSize.bind(this)
    this.toggleGrid = this.toggleGrid.bind(this)
    this.exportSVG = this.exportSVG.bind(this)
  }

  componentDidMount() {
    this.updateCurrentValidMatrix()
  }

  updateCurrentValidMatrix() {
    const { gridSize } = this.props
    const { curves, index } = this.state
    const newCurves = curves.map((curve, i) => {
      if (i === index) {
        curve.validMatrix = ValidMatrix(
          gridSize,
          curve.rules,
          curve.points,
          curve.fillMatrix
        )
      }
      return curve
    })
    this.setState({ curves: newCurves })
  }

  addCurve() {
    const { gridSize } = this.props
    const { curves, strokeWidth } = this.state
    const newCurves = curves.slice()
    newCurves.push({
      points: [],
      rules: [],
      fillMatrix: Matrix(gridSize, false),
      strokeWidth: strokeWidth,
    })
    this.setState(
      {
        curves: newCurves,
        index: newCurves.length - 1,
      },
      this.updateCurrentValidMatrix
    )
  }

  changeCurve(index: number) {
    this.setState(
      {
        index: index,
      },
      this.updateCurrentValidMatrix
    )
  }

  markFilled(point: Point) {
    const { curves, index } = this.state
    const newCurves = curves.map((curve, i) => {
      if (i === index) {
        const { x, y } = point
        curve.fillMatrix[x][y] = true
        curve.points.push(point)
        if (curve.points.length > 1) {
          curve.rules = GenerateRules(curve.points)
        }
      }
      return curve
    })

    this.setState({ curves: newCurves }, this.updateCurrentValidMatrix)
  }

  /**
   * exportSVG exports the generated curve(s) into an SVG file
   */
  exportSVG() {
    const { curves, cellSize } = this.state

    const curvePaths = curves.map((curve, i) => (
      <g key={`curve-${i}`}>
        {curve.rules && curve.rules.length > 1 && (
          <Tiles
            rules={curve.rules}
            points={curve.points}
            cellSize={cellSize}
            strokeWidth={curve.strokeWidth}
          />
        )}
      </g>
    ))
    var svgDoc = document.implementation.createDocument(
      'http://www.w3.org/2000/svg',
      'svg',
      null
    )
    ReactDOM.render(curvePaths, svgDoc.documentElement)
    // get the data
    var svgData = new XMLSerializer().serializeToString(svgDoc)
    var blob = new Blob([svgData])
    saveAs(blob, `curve-${Math.random().toPrecision(5)}.svg`)
  }

  /**
   * toggleGrid toggles the visibility of the grid
   */
  toggleGrid(): void {
    const { gridChecked } = this.state
    this.setState({
      gridChecked: !gridChecked,
    })
  }

  /**
   * updateCellSize updates the size of cells in the grid
   * @param e
   */
  updateCellSize(e: ChangeEvent<HTMLInputElement>): void {
    const updatedCellSize = Number((e.target as HTMLInputElement).value)
    this.setState({ cellSize: updatedCellSize })
  }

  /**
   * updateStrokeWidth updates the application's stroke width, as well as the current curve's stroke width
   * @param e
   */
  updateStrokeWidth(e: ChangeEvent<HTMLInputElement>): void {
    const { curves, index } = this.state
    const updatedWidth = Number((e.target as HTMLInputElement).value)
    this.setState({ strokeWidth: updatedWidth })
    const newCurves = curves.map((curve, i) => {
      if (i === index) {
        curve.strokeWidth = updatedWidth
      }
      return curve
    })
    this.setState({ curves: newCurves })
  }

  render() {
    const { gridSize } = this.props
    const { cellSize, curves, index, gridChecked, strokeWidth } = this.state
    return (
      <Auth withLoginPrompt>
        <div className="Curves">
          <Controls
            addCurve={this.addCurve}
            changeCurve={this.changeCurve}
            curvesLength={curves.length}
            currentCurveIndex={index}
            cellSize={cellSize}
            exportSVG={this.exportSVG}
            gridChecked={gridChecked}
            strokeWidth={strokeWidth}
            toggleGrid={this.toggleGrid}
            updateCellSize={this.updateCellSize}
            updateStrokeWidth={this.updateStrokeWidth}
          />
          <svg className="FullHeight">
            <Grid
              cellSize={cellSize}
              gridSize={gridSize}
              fillMatrix={curves[index].fillMatrix}
              validMatrix={curves[index].validMatrix}
              markFilled={this.markFilled}
              points={curves[index].points}
              rules={curves[index].rules}
              visible={gridChecked}
            />
            {curves &&
              curves.map((curve, i) => (
                <g key={`curve-${i}`}>
                  {curve.rules && curve.rules.length > 1 && (
                    <Tiles
                      rules={curve.rules}
                      points={curve.points}
                      cellSize={cellSize}
                      strokeWidth={curve.strokeWidth}
                    />
                  )}
                </g>
              ))}
          </svg>
        </div>
      </Auth>
    )
  }
}

export default Curves
