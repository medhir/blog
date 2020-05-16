import React, {
  useState,
  useEffect,
  FormEvent,
  ReactNode,
  ReactElement,
} from 'react'

import Login from './login'
import http from '../../utility/http'

interface AuthProps {
  prompt?: Boolean // if true, will show a login form when user is unauthenticated
  children: ReactNode
}

const Auth = ({ children, prompt }: AuthProps): ReactElement => {
  const [validated, setValidated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

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
        setError({ error: error })
      })
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
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
        {error && (
          <>
            <p>Login Failed</p>
            <pre>{JSON.stringify(error, undefined, 2)}</pre>
          </>
        )}
      </>
    )
  }

  return null
}

export default Auth
