/**
 * Generator generates an empty matrix to construct a grid
 * @param {Number} size size of the grid
 */
export const Generator = size => {
  const grid = []
  for (let i = 0; i < size; i++) {
    const row = []
    for (let j = 0; j < size; j++) {
      row.push(0)
    }
    grid.push(row)
  }
  return grid
}
