import React, { Component } from 'react';
import http from 'axios';
import './Photos.css';
import Photo from '../../Layout/Photo';

// const BASE_URL = "http://192.168.1.140:8000";

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
        {
            props.photos.map((photo) => <Photo className="photo" src={ `/assets/photos/${ photo }`} />)
        }
    </section>  
);


// returns an array of Photo components
// as an album

class Photos extends Component {
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

export default Photos;