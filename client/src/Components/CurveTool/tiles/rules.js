import { Directions } from '../utils'

/**
 * The Rules object stores rules that define the path for a particular Peano curve.
 * Each key in the Rules object describes the direction of the generated curve.
 * Each direction contains both a horizontally and vertically oriented curve
 * common describes the path of the tile:
 *  - angles describes the start and end angle of the arc section
 *  - direction describes the direction to move the cursor to generate the next arc section.
 * connector contains path information for connecting a tile in a certain direction.
 * next contains valid directions for the next tile on the path
 */
export const Rules = {
  RightUp: {
    Horizontal: {
      common: [
        {
          angles: [-45, 45],
          direction: Directions.RightUp,
        },
        {
          angles: [-45, 225],
          direction: Directions.LeftUp,
        },
        {
          angles: [-225, 45],
          direction: Directions.RightUp,
        },
        {
          angles: [135, 225],
        },
      ],
      connector: {
        Right: [
          {
            direction: Directions.RightDown,
          },
          {
            angles: [-45, 45],
          },
        ],
        Up: [
          {
            angles: [45, 225],
          },
        ],
      },
    },
    Vertical: {
      common: [
        {
          angles: [45, 135],
          direction: Directions.RightUp,
        },
        {
          angles: [-135, 135],
          direction: Directions.RightDown,
        },
        {
          angles: [45, 315],
          direction: Directions.RightUp,
        },
        {
          angles: [225, 315],
        },
      ],
      connector: {
        Right: [
          {
            angles: [-45, 45],
          },
          {
            direction: Directions.RightUp,
          },
        ],
        Up: [
          {
            direction: Directions.LeftUp,
          },
          {
            angles: [45, 135],
          },
        ],
      },
    },
  },
  LeftUp: {
    Horizontal: {
      common: [
        {
          angles: [-45, 45],
          direction: Directions.LeftUp,
        },
        {
          angles: [-225, 45],
          direction: Directions.RightUp,
        },
        {
          angles: [-45, 225],
          direction: Directions.LeftUp,
        },
        {
          angles: [135, 315],
          direction: Directions.LeftUp,
        },
      ],
    },
    Vertical: {
      common: [
        {
          angles: [225, 315],
          direction: Directions.LeftUp,
        },
        {
          angles: [-135, 135],
          direction: Directions.LeftDown,
        },
        {
          angles: [45, 315],
          direction: Directions.LeftUp,
        },
        {
          angles: [45, 135],
          direction: Directions.RightUp,
        },
        {
          angles: [225, 315],
          direction: Directions.LeftUp,
        },
      ],
    },
  },
  RightDown: {
    Horizontal: {
      common: [
        {
          angles: [135, 225],
          direction: Directions.RightDown,
        },
        {
          angles: [-45, 225],
          direction: Directions.LeftDown,
        },
        {
          angles: [-225, 45],
          direction: Directions.RightDown,
        },
        {
          angles: [-45, 135],
        },
      ],
    },
    Vertical: {
      common: [
        {
          angles: [45, 135],
          direction: Directions.RightDown,
        },
        {
          angles: [45, 315],
          direction: Directions.RightUp,
        },
        {
          angles: [-135, 135],
          direction: Directions.RightDown,
        },
        {
          angles: [135, 315],
        },
      ],
    },
  },
  LeftDown: {
    Horizontal: {
      common: [
        {
          angles: [135, 225],
          direction: Directions.LeftDown,
        },
        {
          angles: [-225, 45],
          direction: Directions.RightDown,
        },
        {
          angles: [-45, 225],
          direction: Directions.LeftDown,
        },
        {
          angles: [-135, 45],
        },
      ],
    },
    Vertical: {
      common: [
        {
          angles: [225, 315],
          direction: Directions.LeftDown,
        },
        {
          angles: [45, 315],
          direction: Directions.LeftUp,
        },
        {
          angles: [-135, 135],
          direction: Directions.LeftDown,
        },
        {
          angles: [45, 135],
          direction: Directions.RightDown,
        },
        {
          angles: [225, 315],
        },
      ],
    },
  },
}
