import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

const Markdown = (props) => {
    
    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        for (let i = 0; i < files.length; i++) {
            console.log(`
            File Name: ${files[i].name}
            File Type: ${files[i].type}
            File Size: ${files[i].size}
            `)
        }
    }

    const handlePaste = (e) => {
        // e.preventDefault();
        console.log("A paste happened");
    }

    return (
        <TextareaAutosize
            value={ props.markdown } 
            onChange={ props.parse } 
            onDrop={ handleDrop }
            onPaste={ handlePaste }
        />
    )
}

export default Markdown;