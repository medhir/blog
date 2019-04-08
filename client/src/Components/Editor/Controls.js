import React, { Fragment } from 'react';
import { EditButton, SaveButton, PublishButton } from '../../Controls/Buttons';

const Controls = (props) => {
    return (
        <div className="editor-controls">
            { 
                props.edit === true ? 
                <SaveButton onClick={ props.saveDraft }>Save Draft</SaveButton> :
                (
                    <Fragment>
                        <EditButton onClick={ props.openEditor }>Edit</EditButton>
                        <PublishButton onClick={ props.publish }>Publish</PublishButton>
                    </Fragment>
                )
            }
        </div>
    )
}

export default Controls;