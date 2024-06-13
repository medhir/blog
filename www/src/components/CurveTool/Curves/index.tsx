//@ts-nocheck
import React, { Component, ChangeEvent } from "react";
import ReactDOM from "react-dom";
import { saveAs } from "file-saver";
import Grid from "@/components/CurveTool/Grid";
import { Point, Rule } from "@/components/CurveTool/Grid/types";
import Controls from "./controls";
import { Tiles } from "@/components/CurveTool/Path";
import styles from "./styles.module.css";
import { Matrix, ValidMatrix } from "@/components/CurveTool/Grid/util";
import { GenerateRules } from "./rule_generator";

interface CurveData {
  points: Point[];
  rules: Rule[];
  strokeWidth: number;
  fillMatrix: boolean[][];
  validMatrix?: boolean[][];
}

export interface GridDimensions {
  width: number;
  height: number;
}

interface CurveProps {}

interface CurvesState {
  cellSize: number;
  curves?: CurveData[];
  index: number;
  gridChecked: boolean;
  gridDimensions?: GridDimensions;
  mobile: boolean;
  strokeWidth: number;
}

const InitialStrokeWidth = 2;
const InitialCellSize = 25;

class Curves extends Component<CurveProps, CurvesState> {
  rootRef: React.RefObject<HTMLDivElement>;
  constructor(props: CurveProps) {
    super(props);
    this.state = {
      strokeWidth: InitialStrokeWidth,
      gridChecked: true,
      cellSize: InitialCellSize,
      index: 0,
      mobile: false,
    };

    this.rootRef = React.createRef();

    this.addCurve = this.addCurve.bind(this);
    this.changeCurve = this.changeCurve.bind(this);
    this.checkIfMobile = this.checkIfMobile.bind(this);
    this.markFilled = this.markFilled.bind(this);
    this.updateStrokeWidth = this.updateStrokeWidth.bind(this);
    this.updateCellSize = this.updateCellSize.bind(this);
    this.updateGridDimensions = this.updateGridDimensions.bind(this);
    this.toggleGrid = this.toggleGrid.bind(this);
    this.exportSVG = this.exportSVG.bind(this);
  }

  componentDidMount() {
    this.checkIfMobile();
    setTimeout(this.updateGridDimensions, 10);
    this.updateGridDimensions();
    window.addEventListener("resize", this.checkIfMobile);
    window.addEventListener("resize", this.updateGridDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.checkIfMobile);
    window.removeEventListener("resize", this.updateGridDimensions);
  }

  checkIfMobile() {
    this.setState({
      mobile: window.innerWidth < 600,
    });
  }

  updateCurrentValidMatrix() {
    const { curves, index, gridDimensions } = this.state;
    const newCurves = curves.map((curve, i) => {
      if (i === index) {
        curve.validMatrix = ValidMatrix(
          gridDimensions,
          curve.rules,
          curve.points,
          curve.fillMatrix
        );
      }
      return curve;
    });
    this.setState({ curves: newCurves });
  }

  addCurve() {
    const { curves, strokeWidth, gridDimensions } = this.state;
    const newCurves = curves.slice();
    newCurves.push({
      points: [],
      rules: [],
      fillMatrix: Matrix(gridDimensions, false),
      strokeWidth: strokeWidth,
    });
    this.setState(
      {
        curves: newCurves,
        index: newCurves.length - 1,
      },
      this.updateCurrentValidMatrix
    );
  }

  changeCurve(index: number) {
    this.setState(
      {
        index: index,
      },
      this.updateCurrentValidMatrix
    );
  }

  markFilled(point: Point) {
    const { curves, index } = this.state;
    const newCurves = curves.map((curve, i) => {
      if (i === index) {
        const { x, y } = point;
        curve.fillMatrix[x][y] = true;
        curve.points.push(point);
        if (curve.points.length > 1) {
          curve.rules = GenerateRules(curve.points);
        }
      }
      return curve;
    });

    this.setState({ curves: newCurves }, this.updateCurrentValidMatrix);
  }

  /**
   * exportSVG exports the generated curve(s) into an SVG file
   */
  exportSVG() {
    const { curves, cellSize } = this.state;

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
    ));
    var svgDoc = document.implementation.createDocument(
      "http://www.w3.org/2000/svg",
      "svg",
      null
    );
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.render(curvePaths, svgDoc.documentElement);
    // get the data
    var svgData = new XMLSerializer().serializeToString(svgDoc);
    var blob = new Blob([svgData]);
    saveAs(blob, `curve-${Math.random().toPrecision(5)}.svg`);
  }

  /**
   * toggleGrid toggles the visibility of the grid
   */
  toggleGrid(): void {
    const { gridChecked } = this.state;
    this.setState({
      gridChecked: !gridChecked,
    });
  }

  /**
   * updateCellSize updates the size of cells in the grid
   * @param e
   */
  updateCellSize(e: ChangeEvent<HTMLInputElement>): void {
    const updatedCellSize = Number((e.target as HTMLInputElement).value);
    this.setState({ cellSize: updatedCellSize });
  }

  updateGridDimensions(): void {
    const { cellSize } = this.state;

    if (this.rootRef.current) {
      const width = this.rootRef.current.offsetWidth;
      const height = this.rootRef.current.offsetHeight;
      const gridDimensions = {
        width: Math.floor(width / cellSize) - 1,
        height: Math.floor(height / cellSize) - 1,
      };
      this.setState(
        {
          gridDimensions: gridDimensions,
          curves: [
            {
              points: [],
              rules: [],
              fillMatrix: Matrix(gridDimensions, false),
              validMatrix: Matrix(gridDimensions, false),
              strokeWidth: InitialStrokeWidth,
            },
          ],
          index: 0,
        },
        () => {
          this.updateCurrentValidMatrix();
        }
      );
    }
  }

  /**
   * updateStrokeWidth updates the application's stroke width, as well as the current curve's stroke width
   * @param e
   */
  updateStrokeWidth(e: ChangeEvent<HTMLInputElement>): void {
    const { curves, index } = this.state;
    const updatedWidth = Number((e.target as HTMLInputElement).value);
    this.setState({ strokeWidth: updatedWidth });
    const newCurves = curves.map((curve, i) => {
      if (i === index) {
        curve.strokeWidth = updatedWidth;
      }
      return curve;
    });
    this.setState({ curves: newCurves });
  }

  render() {
    const {
      cellSize,
      curves,
      index,
      gridChecked,
      gridDimensions,
      strokeWidth,
    } = this.state;
    return (
      <div className={styles.Curves}>
        {curves && (
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
        )}
        <div ref={this.rootRef} className={styles.svgContainer}>
          <svg className={styles.FullHeight}>
            {curves && (
              <Grid
                cellSize={cellSize}
                gridDimensions={gridDimensions}
                fillMatrix={curves[index].fillMatrix}
                validMatrix={curves[index].validMatrix}
                markFilled={this.markFilled}
                points={curves[index].points}
                rules={curves[index].rules}
                visible={gridChecked}
              />
            )}
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
      </div>
    );
  }
}

export default Curves;
