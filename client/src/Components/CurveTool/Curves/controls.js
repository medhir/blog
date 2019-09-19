import React from 'react'

const Range = ({ children, onChange, min, max, step, value, id }) => (
  <div className="Lines__input">
    <label htmlFor={id}>{children}</label>
    <input
      type="range"
      name={id}
      min={min}
      max={max}
      value={value}
      step={step}
      id={id}
      onChange={onChange}
    />
  </div>
)

const Checkbox = ({ children, onChange, checked, id }) => (
  <div className="Lines__input">
    <label htmlFor={id}>{children}</label>
    <input type="checkbox" name={id} checked={checked} onChange={onChange} />
  </div>
)

const Controls = ({
  strokeWidth,
  gridChecked,
  updateStrokeWidth,
  toggleGrid,
}) => (
  <div className="Lines__input-group">
    <Range
      id="stroke-width"
      min="0.1"
      max="5"
      step="0.05"
      onChange={updateStrokeWidth}
      value={strokeWidth}
    >
      Stroke Width
    </Range>
    <Checkbox id="grid" checked={gridChecked} onChange={toggleGrid}>
      Grid
    </Checkbox>
  </div>
)

export default Controls
