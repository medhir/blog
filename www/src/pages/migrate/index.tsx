import { Button } from '@material-ui/core'
import { GetServerSideProps } from 'next'
import { Component } from 'react'
import { AlertData, ErrorAlert, SuccessAlert } from '../../components/alert'
import { Roles } from '../../components/auth'
import Login from '../../components/auth/login'
import { Authenticated } from '../../utility/auth'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'

import styles from './migrate.module.scss'
import { Protected } from '../../utility/http'
import { AxiosError } from 'axios'

interface MigrateProps {
  auth: boolean
}

interface MigrateState {
  errorAlert: AlertData
  successAlert: AlertData
}

class Migrate extends Component<MigrateProps, MigrateState> {
  constructor(props: MigrateProps) {
    super(props)
    this.state = {
      errorAlert: {
        open: false,
        message: '',
      },
      successAlert: {
        open: false,
        message: '',
      },
    }

    this.closeSuccessAlert = this.closeSuccessAlert.bind(this)
    this.closeErrorAlert = this.closeErrorAlert.bind(this)
    this.getVersion = this.getVersion.bind(this)
    this.migrateUp = this.migrateUp.bind(this)
    this.migrateDown = this.migrateDown.bind(this)
    this.migrateBlog = this.migrateBlog.bind(this)
  }

  closeSuccessAlert() {
    this.setState({
      successAlert: {
        open: false,
        message: '',
      },
    })
  }

  closeErrorAlert() {
    this.setState({
      errorAlert: {
        open: false,
        message: '',
      },
    })
  }

  migrateUp() {
    Protected.Client.Get('/migrate/up')
      .then((response) => {
        console.dir(response)
        this.setState({
          successAlert: {
            open: true,
            message: 'Migrated up one step successfully',
          },
        })
      })
      .catch((error: AxiosError) => {
        this.setState({
          errorAlert: {
            open: true,
            message: error.response.data,
          },
        })
      })
  }

  migrateDown() {
    Protected.Client.Get('/migrate/down')
      .then((response) => {
        console.dir(response)
        this.setState({
          successAlert: {
            open: true,
            message: 'Migrated down one step successfully',
          },
        })
      })
      .catch((error: AxiosError) => {
        this.setState({
          errorAlert: {
            open: true,
            message: error.response.data,
          },
        })
      })
  }

  migrateBlog() {
    Protected.Client.Get('/migrate/blog')
      .then((response) => {
        console.dir(response)
        this.setState({
          successAlert: {
            open: true,
            message: 'Migrated blog successfully',
          },
        })
      })
      .catch((error: AxiosError) => {
        this.setState({
          errorAlert: {
            open: true,
            message: error.response.data,
          },
        })
      })
  }

  getVersion() {
    Protected.Client.Get('/migrate/version')
      .then((response) => {
        console.dir(response)
        this.setState({
          successAlert: {
            open: true,
            message: `The database version is ${response.data.version} ${
              response.data.dirty ? 'and it is dirty' : 'and it is not dirty'
            }.`,
          },
        })
      })
      .catch((error: AxiosError) => {
        this.setState({
          errorAlert: {
            open: true,
            message: error.response.data,
          },
        })
      })
  }

  render() {
    const { auth } = this.props
    const { errorAlert, successAlert } = this.state
    const {
      closeErrorAlert,
      closeSuccessAlert,
      getVersion,
      migrateUp,
      migrateDown,
      migrateBlog,
    } = this
    if (auth) {
      return (
        <section className={styles.migrate}>
          <div>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              startIcon={<ArrowUpwardIcon />}
              onClick={migrateUp}
            >
              Migrate Up
            </Button>
          </div>
          <div>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              startIcon={<ArrowDownwardIcon />}
              onClick={migrateDown}
            >
              Migrate Down
            </Button>
          </div>
          <div>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              startIcon={<LibraryBooksIcon />}
              onClick={migrateBlog}
            >
              Migrate Blog
            </Button>
          </div>
          <div>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              startIcon={<LibraryBooksIcon />}
              onClick={getVersion}
            >
              Get DB Version
            </Button>
          </div>
          {errorAlert.open && (
            <ErrorAlert open={errorAlert.open} onClose={closeErrorAlert}>
              {errorAlert.message}
            </ErrorAlert>
          )}
          {successAlert.open && (
            <SuccessAlert open={successAlert.open} onClose={closeSuccessAlert}>
              {successAlert.message}
            </SuccessAlert>
          )}
        </section>
      )
    } else {
      return <Login role={Roles.BlogOwner} />
    }
  }
}

export default Migrate

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const response = await Authenticated(ctx, Roles.BlogOwner)
  return {
    props: { auth: response.auth },
  }
}
