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
  const [error, setError] = useState(null)

  const login = (e: FormEvent<HTMLElement>) => {
    e.preventDefault()
    const credentials = {
      loginID: e.target[0].value,
      password: e.target[1].value,
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

  useEffect(() => {
    http
      .Get('/jwt/validate', {
        withCredentials: true,
      })
      .then(() => {
        setValidated(true)
      })
      .catch((error) => {
        setError(error)
      })
  }, [])

  if (validated) {
    // if user is authenticated, return components wrapped by Auth
    return <>{children}</>
  } else if (prompt) {
    // if prompt prop is specified as true, show a login form
    return (
      <>
        <Login login={login} />
        {error && (
          <>
            <p>Login Failed</p>
            <pre>{JSON.stringify(error)}</pre>
          </>
        )}
      </>
    )
  }

  return null
}

export default Auth
