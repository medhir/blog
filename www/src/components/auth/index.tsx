import React, { useState, useEffect, ReactNode, ReactElement } from 'react'

import Login from './login'
import http from '../../utility/http'
import { Snackbar } from '@material-ui/core'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
import { ErrorAlert } from '../alert'

interface AuthProps {
  prompt?: Boolean // if true, will show a login form when user is unauthenticated
  children: ReactNode
}

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

const Auth = ({ children, prompt }: AuthProps): ReactElement => {
  const [validated, setValidated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [alertOpen, setAlertOpen] = React.useState(false)

  const login = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    const credentials = {
      loginID: username,
      password: password,
    }

    http
      .Post('/login', { ...credentials }, { withCredentials: true })
      .then(() => {
        setValidated(true)
      })
      .catch((error) => {
        setAlertOpen(true)
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

    setAlertOpen(false)
  }

  useEffect(() => {
    http
      .Get('/jwt/validate', {
        withCredentials: true,
      })
      .then(() => {
        setValidated(true)
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
          login={login}
          inputHandlers={{
            handleUsernameChange,
            handlePasswordChange,
          }}
          username={username}
          password={password}
        />
        {alertOpen && (
          <ErrorAlert onClose={handleClose} open={alertOpen}>
            there was an issue logging you in. please try again.
          </ErrorAlert>
        )}
      </>
    )
  }

  return null
}

export default Auth
