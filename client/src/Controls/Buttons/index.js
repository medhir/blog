import React from 'react';
import './Buttons.css';

export const EditButton = (props) => {
    return <button className="button-edit" onClick={ props.onClick }>{ props.children }</button>;
}

export const SaveButton = (props) => {
    return <button className="button-save" onClick={ props.onClick }>{ props.children }</button>;
}

