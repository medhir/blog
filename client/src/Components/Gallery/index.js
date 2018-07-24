import React, { Component, Fragment } from 'react';
import { Route, Link } from "react-router-dom";
import './Gallery.css';
import Photo from '../../Layout/Photo';
import Loading from '../../Layout/Loading';
import api from './api';

const Album = (props) => {
    const preview = props.album.Images.slice(0,4);
    return (
        <div className="album" album={ props.album } onClick={ props.onClick }>
            <Link to={ `/photos/${ props.album.Name }` }>
                <h1>{ props.album.Name }</h1>
                <div class="thumbnails">
                {
                    preview.map(photo => <img src={ `/assets/photos/${props.album.Name}/${photo}` } alt=""/>)
                }
                </div>
            </Link>
        </div>
    );
};

const Albums = (props) => {
    return (
        <section className="albums">
        {
            props.albums.map((album) => <Album album={ album } key={ album.Name } />)
        }
        </section>
    )
}

const PhotoGallery = (props) => {
    const photos = props.getPhotos(props.album);
    return (
        <section className="photos">
        {
            photos.map((photo) => <Photo className="photo" src={ `/assets/photos/${ props.album }/${ photo }`} />)
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
            album: null,
            albums: null,
            photos: null,
            error: null
        }
    }

    getPhotos = (albumName) => {
        const album = this.state.albums.find(album => album.Name === albumName);
        return album.Images;
    }

    componentDidMount = () => {
        api.getAlbums()
            .then((response) => {
                console.dir(response.data);
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
            return (
                <Fragment>
                    <Route exact path={ this.props.match.path }
                                 render={ () => <Albums albums={ this.state.albums } getPhotos={ this.getPhotos }/> } />
                    <Route path={ `${ this.props.match.url }/:album` } 
                           render={ (props) => <PhotoGallery album={ props.match.params.album } getPhotos={ this.getPhotos }/> } />
                </Fragment>
            );
        } else {
            return <Loading />;
        }
    }
}

export default Gallery;