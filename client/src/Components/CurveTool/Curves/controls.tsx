import React, { ChangeEvent } from 'react'

interface RangeProps {
  children: React.ReactNode
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  min: number
  max: number
  step: number
  value: number
  id: string
}
const Range = ({
  children,
  onChange,
  min,
  max,
  step,
  value,
  id,
}: RangeProps) => (
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

interface CheckboxProps {
  children: React.ReactNode
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  checked: boolean
  id: string
}
const Checkbox = ({ children, onChange, checked, id }: CheckboxProps) => (
  <div className="Curves__input">
    <label htmlFor={id}>{children}</label>
    <input type="checkbox" name={id} checked={checked} onChange={onChange} />
  </div>
)

interface CurveSelectorProps {
  curvesLength: number
  changeCurve: (index: number) => void
}
const CurveSelector = ({ curvesLength, changeCurve }: CurveSelectorProps) => {
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

interface ControlsProps {
  addCurve: () => void
  changeCurve: (index: number) => void
  cellSize: number
  curvesLength: number
  gridChecked: boolean
  strokeWidth: number
  toggleGrid: () => void
  updateCellSize: (e: ChangeEvent<HTMLInputElement>) => void
  updateStrokeWidth: (e: ChangeEvent<HTMLInputElement>) => void
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
}: ControlsProps) => (
  <div className="Lines__input-group">
    <button onClick={addCurve}>Add Curve</button>
    <Range
      id="stroke-width"
      min={0.1}
      max={5}
      step={0.05}
      onChange={updateStrokeWidth}
      value={strokeWidth}
    >
      Stroke Width
    </Range>
    <Range
      id="cell-size"
      min={10}
      max={40}
      step={0.5}
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
