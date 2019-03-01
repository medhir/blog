import React, { Component } from 'react';
import Axios from 'axios';

const UploadPath = "/api/upload/"

class Uploader extends Component {
    constructor (props) {
        super(props)
        this.state = {
            progress: null,
            success: null, 
            files: null
        }
    }

    handleFileStateChange = (e) => {
        this.setState({
            files: e.target.files
        })
    }
    handleUpload = (e) => {
        e.preventDefault()
        if (this.state.files) {
            const formData = new FormData();
            for (let i = 0; i < this.state.files.length; i++) {
                formData.append("image", this.state.files[i])
            }
            debugger
            Axios.post(UploadPath, formData, {
                headers: {'Content-Type': 'multipart/form-data' }
            })
            .then(success => {
                console.log(success)
                this.setState({
                    success: true
                })
            }).catch(err => {
                console.error(err)
                this.setState({
                    success: false
                })
            })
        }
    }

    render () {
        return (
            <form>
                <input type="file"
                       accept="image/*"
                       name="images"
                       multiple
                       onChange={ this.handleFileStateChange }
                />
                <button onClick={ (e) => { this.handleUpload(e) } }>Upload</button>
            </form>
        )
    }
}

export default Uploader;