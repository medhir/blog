import React from 'react';
import { EditButton, SaveButton } from '../../Controls/Buttons';

const Controls = (props) => {
    return (
        <div className="editor-controls">
            { 
                props.edit === true ? 
                <SaveButton onClick={ props.onClick }>Save Draft</SaveButton> :
                <EditButton onClick={ props.onClick }>Edit</EditButton>
            }

        </div>
    )
}

export default Controls;