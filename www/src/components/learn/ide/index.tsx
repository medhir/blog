import React, { Component } from 'react'
import http from '../../../utility/http'
import Loading from '../../loading'

import styles from './ide.module.scss'

interface IDEState {
  loading: boolean
}

interface IDEProps {
  url: string
  className?: string
}

class IDE extends Component<IDEProps, IDEState> {
  constructor(props: IDEProps) {
    super(props)
    this.state = {
      loading: false,
    }

    this.startEnvironment = this.startEnvironment.bind(this)
  }

  componentDidMount() {
    this.startEnvironment()
  }

  startEnvironment() {
    // display a loading state to the user
    this.setState(
      {
        loading: true,
      },
      () => {
        setTimeout(() => {
          // poll the endpoint until it is healthy
          const { url } = this.props
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
          }, 1500)
        }, 2000)
      }
    )
  }

  render() {
    const { className, url } = this.props
    const { loading } = this.state
    return (
      <section className={`${styles.ide} ${className}`}>
        <div className={styles.ide_environment}>
          {loading && <Loading />}
          {url && !loading && <iframe src={url} />}
        </div>
      </section>
    )
  }
}

export default IDE
