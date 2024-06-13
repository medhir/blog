/**
 * Directions enumerates possible directions for the cursor to move
 */
export const Directions = {
  Up: "Up",
  Down: "Down",
  Left: "Left",
  Right: "Right",
  RightUp: "RightUp",
  RightDown: "RightDown",
  LeftUp: "LeftUp",
  LeftDown: "LeftDown",
};

/**
 * PotentialDiagonalDirections describes the potential diagonal directions a tile can take,
 * given a horizontal or vertical direction
 */
export const PotentialDiagonalDirections = {
  Up: [Directions.RightUp, Directions.LeftUp],
  Down: [Directions.RightDown, Directions.LeftDown],
  Right: [Directions.RightUp, Directions.RightDown],
  Left: [Directions.LeftUp, Directions.LeftDown],
};

export const NextDiagonalDirection = {
  RightUp: {
    Right: Directions.RightDown,
    Up: Directions.LeftUp,
  },
  RightDown: {
    Right: Directions.RightUp,
    Down: Directions.LeftDown,
  },
  LeftUp: {
    Left: Directions.LeftDown,
    Up: Directions.RightUp,
  },
  LeftDown: {
    Left: Directions.LeftUp,
    Down: Directions.RightDown,
  },
};
