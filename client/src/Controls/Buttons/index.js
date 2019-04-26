import React from 'react';
import './Buttons.css';

export const EditButton = (props) => {
    return <button className="button-edit" onClick={ props.onClick }>{ props.children }</button>
}

export const DeleteButton = (props) => {
    return <button className="button-edit" onClick={ props.onClick }>{ props.children }</button>
}

export const SaveButton = (props) => {
    return <button className="button-save" onClick={ props.onClick }>{ props.children }</button>
}

export const PublishButton = (props) => {
    return <button className="button-publish" onClick={ props.onClick }>{ props.children }</button>
}

