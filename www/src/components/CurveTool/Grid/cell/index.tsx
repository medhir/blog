import React, { PureComponent } from "react";
import { Point } from "@/components/CurveTool/Grid/types";
import styles from "./styles.module.css";

interface CellProps {
  x: number;
  y: number;
  svgX: number;
  svgY: number;
  size: number;
  filled: boolean;
  valid: number | boolean;
  markFilled: (point: Point) => void;
  visible: boolean;
}

/**
 * Cell renders an SVG rect representing a cell in a grid where lines are drawn
 */
export default class Cell extends PureComponent<CellProps> {
  render() {
    const { x, y, svgX, svgY, size, filled, valid, markFilled, visible } =
      this.props;
    return (
      <rect
        x={svgX}
        y={svgY}
        width={size}
        height={size}
        className={`${styles.gridCell} 
        ${filled ? styles.gridCellFilled : null}
        ${valid ? styles.gridCellValid : styles.gridCellInvalid}
        ${visible ? null : styles.gridCellInvisible}`}
        onClick={() => {
          if (valid) markFilled({ x, y });
        }}
      />
    );
  }
}
