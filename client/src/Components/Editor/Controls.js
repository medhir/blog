import React from 'react';
import { Button } from '../../Controls/Button';

const Controls = (props) => {
    return (
        <div className="editor-controls">
            <Button edit={ props.edit } type={ props.type } onClick={ props.onClick } />
        </div>
    )
}

export default Controls;