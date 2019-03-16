import React, { Component } from 'react';
import './Photo.css';

class Photo extends Component {
    render () {
        return (
            <a className={ this.props.className } href={ this.props.src }>
                <img src={ this.props.src } alt={ this.props.alt } />
            </a>
        )
    }
}

export default Photo;