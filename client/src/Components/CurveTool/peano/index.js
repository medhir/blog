import React from 'react'
import {
  FullVertical,
  FullVerticalFlipped,
  FullHorizontal,
  FullHorizontalFlipped,
} from './tiles'

export const PeanoCurves = {
  Vertical: props =>
    props.flipped ? (
      <FullVerticalFlipped {...props} />
    ) : (
      <FullVertical {...props} />
    ),
  Horizontal: props =>
    props.flipped ? (
      <FullHorizontalFlipped {...props} />
    ) : (
      <FullHorizontal {...props} />
    ),
}
