import React, { Component } from 'react';
import Auth from '../../../Auth'
import Deleter from '../../../Controls/Deleter'
import './Photo.css';

class Photo extends Component {
    constructor (props) {
        super(props)
        const baseFilename = this.props.s3key.split('/')[2]
        const id = baseFilename.split('.')[0]
        this.state = {
            id: id
        }
    }
    render () {
        return (
            <div className={ this.props.className }>
                <img src={ this.props.src } alt={ this.props.alt } />
                <Auth><Deleter endpoint={`/api/photo?id=${ this.state.id }`} /></Auth>
            </div>
        )
    }
}

export default Photo;