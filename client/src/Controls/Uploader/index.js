import React, { Component } from 'react';

class Uploader extends Component {
    render () {
        return (
            <form action="/api/upload" method="POST" encType="multipart/form-data">
                <input type="file"
                       name="uploads"  
                       multiple
                />
                <input type="submit" value="Submit"/>
            </form>
        )
    }
}

export default Uploader;