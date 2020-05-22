import React, { Component } from 'react'
import http from '../../utility/http'
import { GreenButton, RedButton } from '../button'
import Loading from '../loading'
import { AxiosError } from 'axios'

import styles from './code.module.scss'

interface CodeState {
  error: string
  id: string
  loading: boolean
  url: string
}

class Code extends Component<{}, CodeState> {
  constructor(props: Readonly<{}>) {
    super(props)

    this.state = {
      id: null,
      url: null,
      loading: false,
      error: null,
    }

    this.createEnvironment = this.createEnvironment.bind(this)
    this.stopEnvironment = this.stopEnvironment.bind(this)
  }

  createEnvironment() {
    // display a loading state to the user
    this.setState(
      {
        loading: true,
      },
      () => {
        // request a new coder instance from the server
        http
          .Post('/code/', {}, { withCredentials: true })
          .then((response) => {
            console.dir(response)
            this.setState({
              id: response.data.id,
              url: response.data.url,
            })
            setTimeout(() => {
              this.setState({
                loading: false,
              })
            }, 15000)
          })
          .catch((error: AxiosError) => {
            if (error.response) {
              this.setState({
                error: error.response.data,
              })
            } else {
              this.setState({
                error: error.message,
              })
            }
          })
      }
    )
  }

  stopEnvironment() {
    http
      .Delete(`/code/`, { withCredentials: true })
      .catch((error: AxiosError) => {
        if (error.response) {
          this.setState({
            error: error.response.data,
          })
        } else {
          this.setState({
            error: error.message,
          })
        }
      })
  }

  render() {
    const { error, loading, url } = this.state
    return (
      <section className={styles.coder}>
        <div className={styles.coder_controls}>
          <GreenButton onClick={this.createEnvironment}>
            Start Environment
          </GreenButton>
          <RedButton onClick={this.stopEnvironment}>Stop Environment</RedButton>
          {error && (
            <p>There was an error getting the environment set up: {error}</p>
          )}
        </div>
        <div className={styles.coder_environment}>
          {loading && <Loading />}
          {url && !loading && (
            <iframe
              sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin"
              src={url}
            />
          )}
        </div>
      </section>
    )
  }
}

export default Code
