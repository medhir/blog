import React from 'react';
import './Buttons.css';

export const GreenButton = props => {
  return (
    <button className="button-green" onClick={props.onClick}>
      {props.children}
    </button>
  );
};

export const RedButton = props => {
  return (
    <button className="button-red" onClick={props.onClick}>
      {props.children}
    </button>
  );
};

export const MagentaButton = props => {
  return (
    <button className="button-magenta" onClick={props.onClick}>
      {props.children}
    </button>
  );
};
