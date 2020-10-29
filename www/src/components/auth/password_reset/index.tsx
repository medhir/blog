import { Button, Container, TextField } from '@material-ui/core'
import { AxiosError } from 'axios'
import { ChangeEvent, Component, FormEvent } from 'react'
import http from '../../../utility/http'
import { Notification, NotificationData } from '../../alert'
import Head from '../../head'
import styles from './password_reset.module.scss'

interface PasswordResetState {
  usernameOrEmail: string
  notification: NotificationData
}

class PasswordReset extends Component<{}, PasswordResetState> {
  constructor(props) {
    super(props)
    this.state = {
      usernameOrEmail: '',
      notification: {
        open: false,
        message: '',
      },
    }

    this.handleNotificationClose = this.handleNotificationClose.bind(this)
    this.handleUsernameOrEmailChange = this.handleUsernameOrEmailChange.bind(
      this
    )
    this.submitPasswordResetRequest = this.submitPasswordResetRequest.bind(this)
  }

  handleNotificationClose() {
    this.setState({
      notification: {
        open: false,
        message: '',
      },
    })
  }

  handleUsernameOrEmailChange(e: ChangeEvent<HTMLInputElement>) {
    this.setState({
      usernameOrEmail: e.target.value,
    })
  }

  submitPasswordResetRequest(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const { usernameOrEmail } = this.state
    http
      .Post('/password_reset', {
        username_or_email: usernameOrEmail,
      })
      .then(() => {
        this.setState({
          notification: {
            open: true,
            message:
              'password reset request sent. please check the email associated with your account to continue.',
            severity: 'info',
          },
        })
      })
      .catch((error: AxiosError) => {
        switch (error.response.status) {
          case 400:
            this.setState({
              notification: {
                open: true,
                message: `We couldn't find a matching email or username in our system. Please try entering a different username or email.`,
                severity: 'error',
              },
            })
            break
          default:
            this.setState({
              notification: {
                open: true,
                message:
                  'Something went wrong on our end. Please try submitting your request again.',
                severity: 'error',
              },
            })
            break
        }
      })
  }

  render() {
    const { notification, usernameOrEmail } = this.state
    const { handleUsernameOrEmailChange, submitPasswordResetRequest } = this
    return (
      <>
        <Head title="reset password" />
        <Container className={styles.password_reset} maxWidth="sm">
          <h2>reset password.</h2>
          <form className={styles.form} onSubmit={submitPasswordResetRequest}>
            <TextField
              required
              className={styles.textField}
              label="username or email"
              variant="outlined"
              size="small"
              value={usernameOrEmail}
              onChange={handleUsernameOrEmailChange}
            />
            <Button
              className={styles.button}
              type="submit"
              variant="contained"
              color="primary"
            >
              Reset Password
            </Button>
          </form>
        </Container>
        <Notification
          onClose={this.handleNotificationClose}
          open={notification.open}
          severity={notification.severity}
        >
          {notification.message}
        </Notification>
      </>
    )
  }
}

export default PasswordReset
