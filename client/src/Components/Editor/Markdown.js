import React, { Component } from 'react';
import { AuthUtil } from '../../Auth/AuthUtility'
import http from '../../Utils/http'
import TextareaAutosize from 'react-textarea-autosize';

const IMAGE_MIME_REGEX = /^image\/(p?jpeg|gif|png)$/i;
const LoadingText = '![](Uploading...)';

class Markdown extends Component {
    containsImage (dtItems) {
        let containsImage = false;
        for (let i = 0; i < dtItems.length; i++) {
            if (IMAGE_MIME_REGEX.test(dtItems[i].type)) {
                containsImage = true;
                break;
            }
        }
        return containsImage;
    }

    insertAtCursor (start, end, textToInsert, input, lastInsert = false) {
        // get current text of the input
        const value = input.value;
        // update the value with new text
        this.props.updateMarkdown(value.slice(0, start) + textToInsert + value.slice(end), () => {
            if (lastInsert) {
                // Update cursor position
                input.selectionStart = input.selectionEnd = start + textToInsert.length;
            }
        })
    }

    removeAtCursor(start, end, textToRemove, input) {
        const value = input.value;
        this.props.updateMarkdown(value.slice(0, start-textToRemove.length) + value.slice(end-textToRemove.length), () => {
            input.selectionStart = input.selectionEnd = start - textToRemove.length;
        })
    }

    handleDrop (e) {
        const items = e.dataTransfer.items;
        this.handleImageItems(e, items)
    }

    handlePaste (e) {
        const items = e.clipboardData.items;
        this.handleImageItems(e, items)
    }

    handleImageItems (e, items) {
        e.persist()
        // store selection start/end positions, original value
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        const originalValue = e.target.value;

        let blob;
        if (this.containsImage(items)) {
            e.preventDefault()
            for (let i = 0; i < items.length; i++) {
                if (IMAGE_MIME_REGEX.test(items[i].type)) {
                    blob = items[i].getAsFile();
                    break;
                }
            }
            // Set uploading message in textarea
            this.insertAtCursor(start, end, LoadingText, e.target)
            // upload file
            const data = new FormData()
            data.append('image', blob)
            http.post(`/api/blog/assets/${ this.props.id }`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `${ AuthUtil.token }`
                }
            }).then(response => {
                console.log(response)
                this.props.updateMarkdown(originalValue, () => {
                    this.insertAtCursor(start, end, `![image](${ response.data[0]["Location"] })`, e.target, true)
                })
            }).catch(err => {
                console.error(err)
            })
        }
    }

    render () {
        return (
            <TextareaAutosize
                value={ this.props.markdown } 
                onChange={ this.props.parse } 
                onDrop={ this.handleDrop.bind(this) }
                onPaste={ this.handlePaste.bind(this) }
            />
        )
    }
}

export default Markdown;