import React, { Component } from 'react'
import http from '../../utility/http'
import Button, { GreenButton, RedButton } from '../button'
import Loading from '../loading'
import { AxiosError } from 'axios'

import styles from './coder.module.scss'

interface CoderState {
  error: string
  id: string
  loading: boolean
  password: string
  url: string
}

class Coder extends Component<{}, CoderState> {
  constructor(props: Readonly<{}>) {
    super(props)

    this.state = {
      id: null,
      url: null,
      loading: false,
      password: null,
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
          .Post('/coder/', {}, { withCredentials: true })
          .then((response) => {
            console.dir(response)
            this.setState({
              id: response.data.id,
              url: response.data.url,
              password: response.data.password,
            })
            setTimeout(() => {
              this.setState({
                loading: false,
              })
            }, 45000)
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
    const { id } = this.state
    http
      .Delete(`/coder/${id}`, { withCredentials: true })
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
    const { error, loading, password, url } = this.state
    return (
      <section className={styles.coder}>
        <div className={styles.coder_controls}>
          <GreenButton onClick={this.createEnvironment}>
            Start Environment
          </GreenButton>
          <RedButton onClick={this.stopEnvironment}>Stop Environment</RedButton>
          {password && <p>The password for your environment is: {password}</p>}
          {error && (
            <p>There was an error getting the environment set up: {error}</p>
          )}
        </div>
        <div className={styles.coder_environment}>
          {loading && <Loading />}
          {url && !loading && <iframe src={url} />}
        </div>
      </section>
    )
  }
}

export default Coder
