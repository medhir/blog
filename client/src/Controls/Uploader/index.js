import React, { Component, Fragment } from 'react';
import Axios from 'axios';

import './Uploader.css'

const UploadPath = "http://localhost:8000/api/upload/"

class Uploader extends Component {
    constructor (props) {
        super(props)
        this.state = {
            progress: null,
            success: null, 
            files: null, 
            error: null
        }
    }

    handleFileStateChange = (e) => {
        this.setState({
            files: e.target.files
        })
    }

    handleProgressEvent = (e) => {
        console.warn('fired')
        if (e.lengthComputable) {
            const percentage = Math.round((e.loaded * 100) / e.total)
            this.setState({
                progress: `${ percentage }%`
            })
        }
    }

    handleUpload = (e) => {
        e.preventDefault()
        if (this.state.files) {
            const formData = new FormData();
            for (let i = 0; i < this.state.files.length; i++) {
                formData.append("image", this.state.files[i])
            }
            Axios.post(UploadPath, formData, {
                headers: {'Content-Type': 'multipart/form-data' }, 
                onUploadProgress: this.handleProgressEvent
            }).then(success => {
                this.setState({
                    success: success
                })
            }).catch(error => {
                this.setState({
                    error: error
                })
            })
        }
    }

    render () {
        return (
            <Fragment>
                <form className="imageForm">
                    <input 
                        type="file"
                        accept="image/*"
                        id="imagesInput"
                        multiple
                        onChange={ this.handleFileStateChange }
                    />
                    <label htmlFor="imagesInput">Choose Images</label>
                    <button className="uploadButton" onClick={ (e) => { this.handleUpload(e) } }>Upload</button>
                </form>
                <p className="progressIndicator">{ this.state.progress }</p>
                <p>{ JSON.stringify(this.state.success) }</p>
            </Fragment>
        )
    }
}

export default Uploader;