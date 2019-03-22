import React from 'react';
import { EditButton, SaveButton } from '../../Controls/Buttons';

const Controls = (props) => {
    return (
        <div className="editor-controls">
            { 
                props.edit === true ? 
                <SaveButton onClick={ props.saveDraft }>Save Draft</SaveButton> :
                <EditButton onClick={ props.openEditor }>Edit</EditButton>
            }
        </div>
    )
}

export default Controls;