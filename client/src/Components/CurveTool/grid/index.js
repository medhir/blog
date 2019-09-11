import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Cell from './cell'
import './index.css'

export default class Grid extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { backingArray } = this.props
    return (
      <svg className="fullHeight">
        <g>
          {backingArray.map((row, rowIndex) => (
            <g>
              {row.map((cell, colIndex) => (
                <Cell
                  x={10 + colIndex * 40}
                  y={10 + rowIndex * 40}
                  size={40}
                  filled={cell === 0 ? false : true}
                />
              ))}
            </g>
          ))}
        </g>
      </svg>
    )
  }
}

Grid.propTypes = {
  backingArray: PropTypes.array.isRequired,
}
