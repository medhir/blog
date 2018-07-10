import React, { Component } from 'react';
import axios from 'axios';
import './Photos.css';
import Photo from '../../Layout/Photo';
import Uploader from '../Uploader';

const http = axios.create({
    baseURL: 'http://localhost:8000'
});

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

const Layout = (props) => (
    <section className="photos">
        <Uploader className="uploader" />
        {
            props.photos.map((photo) => <Photo className="photo" src={ `http://localhost:8000/assets/photos/${ photo }`} />)
        }
    </section>  
);


// returns an array of Photo components
// as a Gallery

class Gallery extends Component {
    constructor (props) {
        super(props);
        this.state = {
            photos: null,
            error: null
        }
    }
    componentDidMount = () => {
        http.get(`/api/photos/`)
            .then((response) => {
                console.dir(response);
                this.setState({
                    photos: response.data
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
        if (this.state.photos) {
            const shuffled = shuffle(this.state.photos);
            return <Layout photos={ shuffled.slice(0,27) } />;
        } else {
            return (
                <section><h2>Loading...</h2></section>
            )
        }
    }
}

export default Gallery;