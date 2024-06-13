//@ts-nocheck
import {
  Directions,
  NextDiagonalDirection,
  PotentialDiagonalDirections,
} from "@/components/CurveTool/Direction";
import { Point, Rule } from "@/components/CurveTool/Grid/types";

/**
 * GetDirection returns the directions given two points
 * @param point1
 * @param point2
 */
const GetDirection = (point1: Point, point2: Point): string | null => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;

  if (dx === 0 && dy === 1) {
    return Directions.Down;
  } else if (dx === 0 && dy === -1) {
    return Directions.Up;
  } else if (dx === 1 && dy === 0) {
    return Directions.Right;
  } else if (dx === -1 && dy === 0) {
    return Directions.Left;
  } else {
    return null;
  }
};

const generateRules = (rules: Rule[], points: Point[]): Rule[] => {
  // get first rule
  const initialRule = rules[0];
  if (!initialRule) {
    return;
  }
  while (rules.length !== points.length) {
    const previousRule = rules[rules.length - 1];
    const { diagonal } = previousRule;
    const point1 = Object.assign({}, points[points.length - rules.length]);
    const point2 = Object.assign({}, points[points.length - 1 - rules.length]);
    const direction = GetDirection(point1, point2);
    const nextDiagonal = NextDiagonalDirection[diagonal][direction];
    if (nextDiagonal) {
      previousRule.direction = direction;
      rules.push({
        diagonal: nextDiagonal,
        direction: direction,
      });
    } else {
      return;
    }
  }
  return rules;
};

/**
 * GenerateRules generates peano curve rules for a continuous line
 * @param points array of points representing a line
 */
export const GenerateRules = (points: Point[]): Rule[] => {
  const pointStack = points.slice().reverse();
  const initialSize = points.length;
  if (initialSize === 0 || initialSize === 1) {
    return [];
  }

  const point1 = Object.assign({}, pointStack[pointStack.length - 1]);
  const point2 = Object.assign({}, pointStack[pointStack.length - 2]);
  const direction = GetDirection(point1, point2);
  const potentialDiagonals = PotentialDiagonalDirections[direction];
  const potentialRules: Rule[][] = [
    generateRules(
      [
        {
          diagonal: potentialDiagonals[0],
          direction: direction,
        },
      ],
      pointStack
    ),
    generateRules(
      [
        {
          diagonal: potentialDiagonals[1],
          direction: direction,
        },
      ],
      pointStack
    ),
  ];
  if (potentialRules[0] && potentialRules[0].length === points.length)
    return potentialRules[0];
  else if (potentialRules[1] && potentialRules[1].length === points.length) {
    return potentialRules[1];
  } else {
    return [];
  }
};
