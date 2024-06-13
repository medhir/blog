import React, { PureComponent } from "react";
import Cell from "./cell";
import { Point, Rule } from "./types";

export interface GridProps {
  cellSize: number;
  className?: string;
  fillMatrix: boolean[][];
  validMatrix: boolean[][];
  gridSize: number;
  markFilled: (point: Point) => void;
  points: Point[];
  rules: Rule[];
  visible: boolean;
}

export default class Grid extends PureComponent<GridProps> {
  render() {
    const { cellSize, fillMatrix, validMatrix, markFilled, visible } =
      this.props;
    return (
      <g>
        {fillMatrix &&
          validMatrix &&
          fillMatrix.map((row, x) => (
            <g key={`cell-row-${x}`}>
              {row.map((cell, y) => (
                <Cell
                  key={`cell-${x}-${y}`}
                  x={x}
                  y={y}
                  svgX={10 + x * cellSize}
                  svgY={10 + y * cellSize}
                  size={cellSize}
                  filled={cell !== false}
                  valid={validMatrix[x][y]}
                  visible={visible}
                  markFilled={() => {
                    markFilled({ x, y });
                  }}
                />
              ))}
            </g>
          ))}
      </g>
    );
  }
}
