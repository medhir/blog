import React, { Component, Fragment } from 'react'
import Loading from 'Components/Loading'
import './Gallery.css'
import Photo from './Photo'
import api from './api'

const BASE_PHOTO_URL = 'https://s3-us-west-2.amazonaws.com/medhir-blog-dev'

const Album = props => {
  return (
    <div
      className="album"
      album={props.album}
      onClick={() => props.getPhotos(props.album)}
    >
      <h1>{props.album}</h1>
    </div>
  )
}

const Albums = props => {
  return (
    <Fragment>
      <section className="albums">
        {props.albums.map(album => (
          <Album album={album} key={album} getPhotos={props.getPhotos} />
        ))}
      </section>
      <section className="addAlbum" />
    </Fragment>
  )
}

const PhotoGallery = props => {
  return (
    <section className="photos">
      {props.photos.map(photo => (
        <Photo
          className="photo"
          src={`${BASE_PHOTO_URL}/${photo}`}
          key={photo}
          s3key={photo}
        />
      ))}
    </section>
  )
}

// returns an array of Photo components
// as a Gallery

class Gallery extends Component {
  constructor(props) {
    super(props)
    this.state = {
      albums: null,
      album: null,
      photos: [],
      displayPhotos: [],
      error: null,
    }
  }

  getPhotos = album => {
    api.getPhotos(album).then(response => {
      this.setState({
        albums: null,
        album: album,
        photos: response.data,
      })
    })
  }

  addDisplayPhotos = () => {
    const startIndex = this.state.displayPhotos.length
    const newPhotoURLS = this.state.photos.slice(startIndex, startIndex + 1)
    const newDisplayPhotos = this.state.displayPhotos.concat(newPhotoURLS)
    this.setState({ displayPhotos: newDisplayPhotos })
  }

  componentDidMount = () => {
    const AlbumName = 'main'
    api
      .getPhotos(AlbumName)
      .then(response => {
        this.setState({ album: AlbumName, photos: response.data })
        const displayPhotos = this.state.photos.slice(0, 3)
        this.setState({ displayPhotos: displayPhotos })
      })
      .catch(error => {
        this.setState({ error: error })
      })

    window.addEventListener('scroll', this.onScroll, false)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false)
  }

  onScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.scrollHeight - 900 &&
      this.state.displayPhotos.length <= this.state.photos.length
    ) {
      this.addDisplayPhotos()
    }
  }

  render() {
    if (this.state.albums) {
      return <Albums albums={this.state.albums} getPhotos={this.getPhotos} />
    } else if (this.state.album) {
      return (
        <PhotoGallery
          album={this.state.album}
          photos={this.state.displayPhotos}
        />
      )
    } else {
      return <Loading />
    }
  }
}

export default Gallery
