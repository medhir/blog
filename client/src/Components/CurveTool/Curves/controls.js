import React from 'react'

const Range = ({ children, onChange, min, max, step, value, id }) => (
  <div className="Curves__input">
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
  <div className="Curves__input">
    <label htmlFor={id}>{children}</label>
    <input type="checkbox" name={id} checked={checked} onChange={onChange} />
  </div>
)

const CurveSelector = ({ curvesLength, changeCurve }) => {
  const curveDescriptors = []
  for (let i = 0; i < curvesLength; i++) {
    curveDescriptors.push({
      name: `Curve ${i + 1}`,
    })
  }
  return (
    <div className="Curves__selector">
      {curveDescriptors.map((descriptor, i) => (
        <button
          onClick={() => {
            changeCurve(i)
          }}
        >
          {descriptor.name}
        </button>
      ))}
    </div>
  )
}

const Controls = ({
  addCurve,
  changeCurve,
  cellSize,
  curvesLength,
  gridChecked,
  strokeWidth,
  toggleGrid,
  updateCellSize,
  updateStrokeWidth,
}) => (
  <div className="Lines__input-group">
    <button onClick={addCurve}>Add Curve</button>
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
    <Range
      id="cell-size"
      min="10"
      max="40"
      step="0.5"
      onChange={updateCellSize}
      value={cellSize}
    >
      Cell Size
    </Range>
    <Checkbox id="grid" checked={gridChecked} onChange={toggleGrid}>
      Grid
    </Checkbox>
    <CurveSelector curvesLength={curvesLength} changeCurve={changeCurve} />
  </div>
)

export default Controls
