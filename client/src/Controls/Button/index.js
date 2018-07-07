import React from 'react';
import './Button.css';

const Types = {
    edit: "edit",
    save: "save",
    add: "add",
}

const Button = (props) => {
    if (props.type === Types.edit || props.type === Types.save) {
        return (
            <button className={ `button button-${ props.type }` }
            onClick={ props.onClick }
            >{ !props.edit ? "Edit" : "Save" }</button>
        );
    }
    else if (props.type === Types.add) {
        return (
            <button className={ `button button-${Types.add}` }
                    onClick={ props.onClick }
                    >Add</button>
        );
    } 
    else {
        return <button className="button" onClick={ this.props.onClick }></button>
    }
}

export { 
    Button, 
    Types 
};