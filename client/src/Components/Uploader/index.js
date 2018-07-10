import React, { Component } from 'react';

class Uploader extends Component {
    render () {
        return (
            <form action="http://localhost:8000/api/photos/upload" method="POST" encType="multipart/form-data">
                <input type="file"
                       accept="image/*"  
                       multiple
                />
                <input type="submit" value="Submit"/>
            </form>
        )
    }
}

export default Uploader;