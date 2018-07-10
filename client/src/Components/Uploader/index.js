import React, { Component } from 'react';

class Uploader extends Component {
    render () {
        return (
            <form action="http://localhost:8000/api/upload" method="POST" encType="multipart/form-data">
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