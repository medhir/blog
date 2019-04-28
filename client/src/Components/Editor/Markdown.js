import React, { Component } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

const IMAGE_MIME_REGEX = /^image\/(p?jpeg|gif|png)$/i;

const Markdown = (props) => {
    const containsImage = (dtItems) => {
        let containsImage = false;
        for (let i = 0; i < dtItems.length; i++) {
            if (IMAGE_MIME_REGEX.test(dtItems[i].type)) {
                containsImage = true;
                break;
            }
        }
        return containsImage;
    }
    const handleDrop = (e) => {
        debugger;
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
        const items = e.clipboardData.items;
        let blob;
        if (containsImage(items)) {
            e.preventDefault()
            for (let i = 0; i < items.length; i++) {
                if (IMAGE_MIME_REGEX.test(items[i].type)) {
                    blob = items[i].getAsFile();
                    break;
                }
            }
            // upload file
            const data = new FormData()
            data.append('file', blob)
            fetch('/api/blog/asset', {
                method: 'POST', 
                body: data
            })
        }
        // get current textarea value
        const value = e.target.value;
        // store selection start/end positions
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;

        debugger;
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