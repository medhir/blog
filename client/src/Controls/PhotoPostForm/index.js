import React, { Component } from 'react';
import './PhotoUploader.css';

class PhotoUploader extends Component {
    render () {
        // auth check
        <form name="photo" action="/api/photo" method="POST" encType="multipart/form-data">
            <input type="file" />
        </form>
    }
}

export default PhotoUploader;