import React, { Component, ReactNode } from 'react'
import { RedButton, GreenButton } from './index'
import './Deleter.css'
import { AxiosPromise } from 'axios'
import styles from 'button.module.scss'

interface ApiButtonProps {
  children: ReactNode
  endpoint: AxiosPromise
  callback: () => void
  successMessage: string
  occuringMessage: string
  errorMessage: string
}

interface ApiButtonState {
  initial: boolean
  confirm: boolean
  occuring: boolean
  success: boolean
  error: boolean
}

/*
    ApiButton is a component for targeted API-based actions.
    'endpoint' prop specifies an api endpoint
    'callback' prop specifies a callback function that is called once the request is successful
 */
class ApiButton extends Component<ApiButtonProps, ApiButtonState> {
  constructor(props: ApiButtonProps) {
    super(props)
    this.state = {
      initial: true,
      confirm: false,
      occuring: false,
      success: false,
      error: false,
    }
  }

  setToConfirm() {
    this.setState({
      initial: false,
      confirm: true,
    })
  }

  revert() {
    this.setState({
      initial: true,
      confirm: false,
    })
  }

  setResource() {
    const { endpoint, callback } = this.props
    this.setState(
      {
        confirm: false,
        occuring: true,
      },
      () => {
        endpoint.then(
          (success) => {
            if (success.status !== 200) {
              this.setState({
                occuring: false,
                error: true,
              })
            } else {
              this.setState(
                {
                  occuring: false,
                  success: true,
                },
                () => {
                  if (callback) {
                    callback()
                  }
                }
              )
            }
          },
          (error) => {
            this.setState({
              occuring: false,
              error: error,
            })
          }
        )
      }
    )
  }

  render() {
    const { initial, confirm, occuring, success, error } = this.state
    const {
      children,
      successMessage,
      occuringMessage,
      errorMessage,
    } = this.props
    if (initial) {
      return (
        <RedButton onClick={this.setToConfirm.bind(this)}>{children}</RedButton>
      )
    } else if (confirm) {
      return (
        <div className={styles.confirm}>
          <p>Are you sure?</p>
          <RedButton onClick={this.setResource.bind(this)}>Yes</RedButton>
          <GreenButton onClick={this.revert.bind(this)}>No</GreenButton>
        </div>
      )
    } else if (occuring) {
      return <RedButton>{occuringMessage}</RedButton>
    } else if (success) {
      return <RedButton>{successMessage}</RedButton>
    } else if (error) {
      return <RedButton>{errorMessage}</RedButton>
    }
  }
}

export default ApiButton
