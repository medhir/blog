import React, { Component } from 'react'
import http from '../../../utility/http'
import { AxiosError } from 'axios'
import LoginForm from './form'
import { ErrorAlert } from '../../alert'

interface LoginErrorAlert {
  open: boolean
  message: string
}

interface LoginProps {
  role: string
}

interface LoginState {
  username: string
  password: string
  loginErrorAlert: LoginErrorAlert
}

class Login extends Component<LoginProps, LoginState> {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      loginErrorAlert: {
        open: false,
        message: '',
      },
    }

    this.closeLoginErrorAlert = this.closeLoginErrorAlert.bind(this)
    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.login = this.login.bind(this)
  }

  closeLoginErrorAlert(event?: React.SyntheticEvent, reason?: string) {
    if (reason === 'clickaway') {
      return
    }

    this.setState({
      loginErrorAlert: {
        open: false,
        message: '',
      },
    })
  }

  handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      username: e.target.value,
    })
  }

  handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      password: e.target.value,
    })
  }

  login(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const { role } = this.props
    const { username, password } = this.state

    http
      .Post(
        '/login',
        {
          loginID: username,
          password,
          role,
        },
        {
          withCredentials: true,
        }
      )
      .then(() => {
        location.reload()
      })
      .catch((error: AxiosError) => {
        this.setState({
          loginErrorAlert: {
            open: true,
            message: error.response.data,
          },
        })
      })
  }

  render() {
    const {
      closeLoginErrorAlert,
      login,
      handleUsernameChange,
      handlePasswordChange,
    } = this
    const { username, password, loginErrorAlert } = this.state
    return (
      <>
        <LoginForm
          login={login}
          inputHandlers={{
            handleUsernameChange: handleUsernameChange,
            handlePasswordChange: handlePasswordChange,
          }}
          username={username}
          password={password}
        />
        {loginErrorAlert.open && (
          <ErrorAlert
            onClose={closeLoginErrorAlert}
            open={loginErrorAlert.open}
          >
            there was an issue logging you in: {loginErrorAlert.message}
          </ErrorAlert>
        )}
      </>
    )
  }
}

export default Login
