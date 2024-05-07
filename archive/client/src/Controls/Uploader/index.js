import React, { Component } from 'react'
import Auth from '../../Auth'
import { AuthUtil } from '../../Auth/AuthUtility'
import api from './api'
import './Uploader.css'

const Files = props => {
  if (props.files) {
    const files = Array.from(props.files)
    return (
      <div className="files">
        <p>Photos to save:</p>
        <ul>
          {files.map((file, i) => (
            <li key={`file-${i}`}>{file.name}</li>
          ))}
        </ul>
      </div>
    )
  } else {
    return null
  }
}

const Locations = props => {
  if (props.locations) {
    return (
      <div className="locations">
        <p>Photos saved at:</p>
        <ul>
          {props.locations.map((location, i) => (
            <li key={`location-${i}`}>
              <a href={location}>{location}</a>
            </li>
          ))}
        </ul>
      </div>
    )
  } else {
    return null
  }
}

class Uploader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      progress: null,
      successLocations: null,
      files: null,
      error: null,
    }
  }

  handleFileStateChange = e => {
    this.setState({
      files: e.target.files,
    })
  }

  handleProgressEvent = e => {
    if (e.lengthComputable) {
      const percentage = Math.round((e.loaded * 100) / e.total)
      this.setState({
        progress: `${percentage}%`,
      })
    }
  }

  handleUpload = e => {
    e.preventDefault()
    if (this.state.files) {
      const formData = new FormData()
      for (let i = 0; i < this.state.files.length; i++) {
        formData.append('image', this.state.files[i])
      }
      api
        .upload(formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${AuthUtil.token}`,
          },
          onUploadProgress: this.handleProgressEvent,
        })
        .then(success => {
          const locations = success.data.map(
            successObj => successObj['Location']
          )
          this.setState({
            files: null,
            successLocations: locations,
          })
        })
        .catch(error => {
          this.setState({
            error: error,
          })
        })
    }
  }

  render() {
    return (
      <Auth withLoginPrompt>
        <form className="imageForm">
          <input
            type="file"
            accept="image/*"
            id="imagesInput"
            multiple
            onChange={this.handleFileStateChange}
          />
          <label htmlFor="imagesInput">Choose Images</label>
          <button
            className="uploadButton"
            onClick={e => {
              this.handleUpload(e)
            }}
          >
            Upload
          </button>
        </form>
        <div className="progressIndicator">
          <div style={{ width: this.state.progress }} />
        </div>
        <Files files={this.state.files} />
        <Locations locations={this.state.successLocations} />
      </Auth>
    )
  }
}

export default Uploader
