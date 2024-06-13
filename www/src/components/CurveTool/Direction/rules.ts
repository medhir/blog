import { Directions } from "./index";

export interface DirectionAndScaleRule {
  direction: string;
  scale: number;
}

export interface DirectionAndAngleRule {
  angles?: [number, number];
  direction?: string;
}

export interface Connector {
  Up?: DirectionAndAngleRule[];
  Down?: DirectionAndAngleRule[];
  Left?: DirectionAndAngleRule[];
  Right?: DirectionAndAngleRule[];
}

export interface HorizontalOrVerticalRule {
  startPoint: DirectionAndScaleRule[];
  common: DirectionAndAngleRule[];
  connector: Connector;
}

export interface DiagonalRule {
  Horizontal: HorizontalOrVerticalRule;
  Vertical: HorizontalOrVerticalRule;
}

export interface DiagonalRules {
  RightUp: DiagonalRule;
  LeftUp: DiagonalRule;
  RightDown: DiagonalRule;
  LeftDown: DiagonalRule;
}
/**
 * Rules stores rules that define the path for a particular Peano curve in a diagonal direction.
 * Each key in the Rules object describes the direction of the generated curve.
 * Each direction contains both a horizontally and vertically oriented curve.
 * startPoint describes instructions for moving the cursor to where the path should start.
 * common describes the path of the tile:
 *  - angles provides the start and end angle of the arc section
 *  - direction provides the direction to move the cursor to generate the next arc section.
 * connector contains path information for connecting a tile in a certain direction.
 * next contains valid directions for the next tile on the path
 */
export const Rules: DiagonalRules = {
  RightUp: {
    Horizontal: {
      startPoint: [
        {
          direction: Directions.RightDown,
          scale: 1,
        },
        {
          direction: Directions.LeftDown,
          scale: 2,
        },
      ],
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
      startPoint: [
        {
          direction: Directions.LeftUp,
          scale: 1,
        },
        {
          direction: Directions.LeftDown,
          scale: 2,
        },
      ],
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
      startPoint: [
        {
          direction: Directions.LeftDown,
          scale: 1,
        },
        {
          direction: Directions.RightDown,
          scale: 2,
        },
      ],
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
          angles: [135, 225],
        },
      ],
      connector: {
        Left: [
          {
            direction: Directions.LeftDown,
          },
          {
            angles: [-45, 45],
          },
        ],
        Up: [
          {
            angles: [225, 315],
          },
        ],
      },
    },
    Vertical: {
      startPoint: [
        {
          direction: Directions.RightUp,
          scale: 1,
        },
        {
          direction: Directions.RightDown,
          scale: 2,
        },
      ],
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
        },
      ],
      connector: {
        Left: [
          {
            angles: [-45, 45],
          },
        ],
        Up: [
          {
            direction: Directions.RightUp,
          },
          {
            angles: [225, 315],
          },
        ],
      },
    },
  },
  RightDown: {
    Horizontal: {
      startPoint: [
        {
          direction: Directions.RightUp,
          scale: 1,
        },
        {
          direction: Directions.LeftUp,
          scale: 2,
        },
      ],
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
          angles: [-45, 45],
        },
      ],
      connector: {
        Right: [
          {
            direction: Directions.RightUp,
          },
          {
            angles: [135, 225],
          },
        ],
        Down: [
          {
            angles: [45, 135],
          },
        ],
      },
    },
    Vertical: {
      startPoint: [
        {
          direction: Directions.LeftDown,
          scale: 1,
        },
        {
          direction: Directions.LeftUp,
          scale: 2,
        },
      ],
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
          angles: [225, 315],
        },
      ],
      connector: {
        Right: [
          {
            angles: [135, 225],
          },
        ],
        Down: [
          {
            direction: Directions.LeftDown,
          },
          {
            angles: [45, 135],
          },
        ],
      },
    },
  },
  LeftDown: {
    Horizontal: {
      startPoint: [
        {
          direction: Directions.LeftUp,
          scale: 1,
        },
        {
          direction: Directions.RightUp,
          scale: 2,
        },
      ],
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
          angles: [-45, 45],
        },
      ],
      connector: {
        Left: [
          {
            direction: Directions.LeftUp,
          },
          {
            angles: [135, 225],
          },
        ],
        Down: [
          {
            angles: [225, 315],
          },
        ],
      },
    },
    Vertical: {
      startPoint: [
        {
          direction: Directions.RightDown,
          scale: 1,
        },
        {
          direction: Directions.RightUp,
          scale: 2,
        },
      ],
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
        },
      ],
      connector: {
        Left: [
          {
            angles: [135, 225],
          },
        ],
        Down: [
          {
            direction: Directions.RightDown,
          },
          {
            angles: [225, 315],
          },
        ],
      },
    },
  },
};
