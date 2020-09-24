import React, { useState, useEffect, ReactNode, ReactElement } from 'react'

import Login from './login'
import http from '../../utility/http'
import { ErrorAlert } from '../alert'
import { AxiosError } from 'axios'

interface AuthProps {
  prompt?: Boolean // if true, will show a login form when user is unauthenticated
  role: String
  children: ReactNode
}

interface LoginErrorAlert {
  open: boolean
  message: string
}

interface AuthState {
  authorized: boolean
  username: string
  password: string
  loginErrorAlert: LoginErrorAlert
}

const LocalStorageAuthorizationKey = 'medhir-com-authorization'
const StatusAuthorized = 'authorized'

export const Roles = {
  BlogOwner: 'blog-owner',
}

const Auth = ({ children, prompt, role }: AuthProps): ReactElement => {
  const [validated, setValidated] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginErrorAlert, setLoginErrorAlert] = React.useState({
    open: false,
    message: '',
  })

  const login = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    const credentials = {
      loginID: username,
      password: password,
      role: role,
    }

    http
      .Post('/login', { ...credentials }, { withCredentials: true })
      .then(() => {
        setValidated(true)
        localStorage.setItem(LocalStorageAuthorizationKey, StatusAuthorized)
      })
      .catch((error: AxiosError) => {
        setLoginErrorAlert({ open: true, message: String(error.response.data) })
      })
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setLoginErrorAlert({
      open: false,
      message: '',
    })
  }

  useEffect(() => {
    const authorizationStatus = localStorage.getItem(
      LocalStorageAuthorizationKey
    )
    if (authorizationStatus !== StatusAuthorized) {
      setValidated(false)
    }
    http
      .Get(`/jwt/validate/${role}`, {
        withCredentials: true,
      })
      .then(() => {
        setValidated(true)
        localStorage.setItem(LocalStorageAuthorizationKey, StatusAuthorized)
      })
      .catch(() => {
        setValidated(false)
        localStorage.setItem(LocalStorageAuthorizationKey, '')
      })
  }, [])

  if (validated) {
    // if user is authenticated, return components wrapped by Auth
    return <>{children}</>
  } else if (prompt) {
    // if prompt prop is specified as true, show a login form
    return (
      <>
        <Login
          role={role}
          inputHandlers={{
            handleUsernameChange,
            handlePasswordChange,
          }}
          username={username}
          password={password}
        />
        {loginErrorAlert.open && (
          <ErrorAlert onClose={handleClose} open={loginErrorAlert.open}>
            there was an issue logging you in. {loginErrorAlert.message}
          </ErrorAlert>
        )}
      </>
    )
  }

  return null
}

export default Auth
