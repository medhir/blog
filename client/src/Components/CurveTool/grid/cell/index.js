import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

/**
 * Cell describes the logic associated with a cell in a grid
 * @param {Object} props
 * @param {Number} props.x start x of cell in svg
 * @param {Number} props.y start y of cell in svg
 * @param {Number} props.size size of the cell
 * @param {Boolean} props.filled whether or not to display a filled color
 * @param {Boolean} props.valid whether the cell is valid to be filled
 * @param {Number} props.rowIndex row index passed from parent Grid
 * @param {Number} props.colIndex column index passed from parent Grid
 * @param {Function} props.markFilled function that sets cell as filled in parent Grid
 */
export default class Cell extends PureComponent {
  render() {
    const { x, y, svgX, svgY, size, filled, valid, markFilled } = this.props
    return (
      <rect
        x={svgX}
        y={svgY}
        width={size}
        height={size}
        className={`grid-cell ${filled ? 'grid-cell-filled' : ''} ${
          valid ? 'grid-cell-valid' : 'grid-cell-invalid'
        }`}
        onClick={() => {
          if (valid)
            markFilled({
              x,
              y,
              svgX,
              svgY,
            })
        }}
      />
    )
  }
}

Cell.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  svgX: PropTypes.number.isRequired,
  svgY: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  filled: PropTypes.bool.isRequired,
  markFilled: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
}
