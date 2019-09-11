import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

/**
 * Cell describes the logic associated with a cell in a grid
 * @param {Number} x start x of cell in svg
 * @param {Number} y start y of cell in svg
 * @param {Number} size size of the cell
 * @param {Boolean} filled whether or not to display a filled color
 */
export default class Cell extends PureComponent {
  constructor(props) {
    super(props)
  }
  render() {
    const { x, y, size, filled } = this.props
    return (
      <rect
        x={x}
        y={y}
        width={size}
        height={size}
        className={`grid-cell ${filled ? 'grid-cell-filled' : ''}`}
      />
    )
  }
}

Cell.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  filled: PropTypes.bool.isRequired,
}
