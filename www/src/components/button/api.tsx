import React, { Component, ReactNode } from 'react'
import { RedButton, GreenButton } from './index'
import styles from './button.module.scss'
import http from '../../utility/http'

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

interface ApiButtonProps {
  children: ReactNode
  className?: string
  endpoint: string
  httpMethod: HttpMethod
  data?: any
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
    const { endpoint, httpMethod, data, callback } = this.props
    this.setState(
      {
        confirm: false,
        occuring: true,
      },
      () => {
        let request
        switch (httpMethod) {
          case HttpMethod.GET:
            request = http.Get(endpoint, { withCredentials: true })
          case HttpMethod.POST:
            request = http.Post(endpoint, data, { withCredentials: true })
          case HttpMethod.PATCH:
            request = http.Patch(endpoint, data, { withCredentials: true })
          case HttpMethod.DELETE:
            request = http.Delete(endpoint, { withCredentials: true })
        }
        request.then(
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

  renderButton() {
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

  render() {
    const { className } = this.props
    return <div className={className}>{this.renderButton()}</div>
  }
}

export default ApiButton
