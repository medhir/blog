import React, { Component } from 'react'
import http from '../../../utility/http'
import { RedButton } from '../../button'
import Loading from '../../loading'
import { AxiosError } from 'axios'

import styles from './ide.module.scss'

interface IDEState {
  error: string
  id: string
  loading: boolean
  url: string
}

interface IDEProps {
  className?: string
}

class IDE extends Component<IDEProps, IDEState> {
  constructor(props: IDEProps) {
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

  componentDidMount() {
    this.createEnvironment()
  }

  createEnvironment() {
    // display a loading state to the user
    this.setState(
      {
        loading: true,
      },
      () => {
        // request a new code instance from the server
        http
          .Post('/code/', {}, { withCredentials: true })
          .then((response) => {
            // set the metadata associated with a code instance
            this.setState(
              {
                id: response.data.id,
                url: response.data.url,
              },
              () => {
                // poll the endpoint until it is healthy
                const { url } = this.state
                const poll = setInterval(() => {
                  http
                    .Get(url)
                    .then(() => {
                      // turn off loading state once endpoint is reachable & stop polling
                      this.setState(
                        {
                          loading: false,
                        },
                        () => {
                          clearInterval(poll)
                        }
                      )
                    })
                    .catch(() => {}) // just to acknowledge the promise (you will be caught my friend!)
                }, 500)
              }
            )
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
    const { className } = this.props
    const { error, loading, url } = this.state
    return (
      <section className={`${styles.ide} ${className}`}>
        <div className={styles.ide_environment}>
          <div className={styles.ide_controls}>
            <RedButton onClick={this.stopEnvironment}>
              Stop Environment
            </RedButton>
            {error && (
              <p>There was an error getting the environment set up: {error}</p>
            )}
          </div>
          {loading && <Loading />}
          {url && !loading && <iframe src={url} />}
        </div>
      </section>
    )
  }
}

export default IDE
