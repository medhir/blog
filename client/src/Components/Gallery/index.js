import React, { Component } from 'react';
import axios from 'axios';
import './Photos.css';
import Photo from '../../Layout/Photo';
import Uploader from '../../Controls/Uploader';
import api from './api';

const shuffle = (a) => {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

const Album = (props) => (
    <section className="album" album={ props.album } onClick={ props.onClick }>
        <h1>{ props.album }</h1>
    </section>
);


// returns an array of Photo components
// as a Gallery

class Gallery extends Component {
    constructor (props) {
        super(props);
        this.state = {
            album: null,
            albums: null,
            photos: null,
            error: null
        }
    }

    Albums = () => (
        <section className="albums">
        {
            this.state.albums.map((album) => <Album album={ album } key={ album } onClick={ () => this.getPhotos(album) } />)
        }
        </section>
    )

    Gallery = () => (
        <section className="photos">
        {
            this.state.photos.map((photo) => <Photo className="photo" src={ `http://localhost:8000/assets/photos/${ this.state.album }/${ photo }`} />)
        }
        </section>  
    )

    getPhotos = (album) => {
        api.getPhotos(album)
           .then((response) => {
               this.setState({
                   albums: null,
                   album: album,
                   photos: response.data
               })
           })
    }

    componentDidMount = () => {
        api.getAlbums()
            .then((response) => {
                console.dir(response);
                this.setState({
                    albums: response.data
                });
            })
            .catch((error) => {
                console.error(error);
                this.setState({
                    error: error
                });
            });
    }

    render () {
        if (this.state.albums) {
            return <this.Albums albums={ this.state.albums } />;
        } else if (this.state.photos) {
            return <this.Gallery album={ this.state.album } photos={ this.state.photos } />;
        } else {
            return (<section><h2>Loading...</h2></section>);
        }
    }
}

export default Gallery;