import React, { Component, Fragment } from 'react';
import Auth from '../../Auth'
import { AuthUtil } from '../../Auth/AuthUtility'
import api from './api'
import './Uploader.css'


const Locations = (props) => {
    if (props.locations) {
        return (
            <Fragment>
                <p>Photos saved at:</p>
                <ul>
                    {
                        props.locations.map(location => <li><a href={ location }>{ location }</a></li>)
                    }
                </ul>
            </Fragment>
        )
    } else {
        return null
    }
}

class Uploader extends Component {
    constructor (props) {
        super(props)
        this.state = {
            progress: null,
            successLocations: null, 
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
            api.upload(formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `JWT ${ AuthUtil.token }`
                }, 
                onUploadProgress: this.handleProgressEvent
            }).then(success => {
                const locations = success.data.map(successObj => successObj["Location"])
                this.setState({
                    successLocations: locations
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
            <Auth>
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
                <div className="progressIndicator">
                    <div style={{ width: this.state.progress }}></div>
                </div>
                <Locations locations={ this.state.successLocations }></Locations>
            </Auth>
        )
    }
}

export default Uploader;