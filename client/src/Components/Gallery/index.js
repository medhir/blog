import React, { Component, Fragment } from 'react';
import { Route, Link } from "react-router-dom";
import './Gallery.css';
import Photo from '../../Layout/Photo';
import Loading from '../../Layout/Loading';
import Uploader from '../../Controls/Uploader'
import api from './api';

const BASE_PHOTO_URL = 'https://s3-us-west-2.amazonaws.com/medhir-blog-dev'

const Album = (props) => {
    return (
        <div className="album" album={ props.album } onClick={ () => props.getPhotos(props.album) }>
            <h1>{ props.album }</h1>
        </div>
    );
};

const Albums = (props) => {
    return (
        <Fragment>
            <section className="albums">
                {
                    props.albums.map((album) => <Album album={ album } key={ album } getPhotos={ props.getPhotos }/>)
                }
            </section>
            <section className="addAlbum"></section>
        </Fragment>
    )
}

const PhotoGallery = (props) => {
    return (
        <section className="photos">
            <h1>{ props.album }</h1>
        {
            props.photos.map((photo) => <Photo className="photo" src={ `${ BASE_PHOTO_URL }/${ photo }`} />)
        }
        </section>  
    )
}

// returns an array of Photo components
// as a Gallery

class Gallery extends Component {
    constructor (props) {
        super(props);
        this.state = {
            albums: null, 
            album: null, 
            photos: null, 
            error: null
        }
    }

    getPhotos = (album) => {
        api.getPhotos(album)
            .then(response => {
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
            return <Albums albums={ this.state.albums } getPhotos={ this.getPhotos }/>;
        } else if (this.state.album) {
            return <PhotoGallery album={ this.state.albums } photos={ this.state.photos }/>;
        } else {
            return <Loading />;
        }
    }
}

export default Gallery;