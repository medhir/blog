import React, { Component } from 'react'
import { RedButton, GreenButton } from '../Buttons'
import { AuthUtil } from 'Auth/AuthUtility'
import http from 'utils/http'
import './Deleter.css'

/*
    Deleter is a component for targeted resource deletion. 
    'endpoint' prop specifies an api endpoint, which deleter then uses to submit a DELETE http request
    'callback' prop specifies a callback function that is called once deletion request is successful
 */
class Deleter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initial: true,
      confirmDelete: false,
      deletionOccuring: false,
      success: false,
      error: false,
    }
  }

  setToConfirm() {
    this.setState({
      initial: false,
      confirmDelete: true,
    })
  }

  revert() {
    this.setState({
      initial: true,
      confirmDelete: false,
    })
  }

  deleteResource() {
    this.setState(
      {
        confirmDelete: false,
        deletionOccuring: true,
      },
      () => {
        http.delete(this.props.endpoint, AuthUtil.authorizationHeader).then(
          success => {
            if (success.status !== 200) {
              this.setState({
                deletionOccuring: false,
                error: true,
              })
            } else {
              this.setState(
                {
                  deletionOccuring: false,
                  success: true,
                },
                () => {
                  if (this.props.callback) {
                    this.props.callback()
                  }
                }
              )
            }
          },
          error => {
            this.setState({
              deletionOccuring: false,
              error: error,
            })
          }
        )
      }
    )
  }

  render() {
    if (this.state.initial) {
      return (
        <RedButton onClick={this.setToConfirm.bind(this)}>Delete</RedButton>
      )
    } else if (this.state.confirmDelete) {
      return (
        <div className="confirmation">
          <p>Are you sure?</p>
          <RedButton onClick={this.deleteResource.bind(this)}>Yes</RedButton>
          <GreenButton onClick={this.revert.bind(this)}>No</GreenButton>
        </div>
      )
    } else if (this.state.deletionOccuring) {
      return <RedButton>Deleting...</RedButton>
    } else if (this.state.success) {
      return <RedButton>Resource Deleted</RedButton>
    } else if (this.state.error) {
      return <RedButton>Can't Delete :-(</RedButton>
    }
  }
}

export default Deleter
