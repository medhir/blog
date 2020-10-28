import React, { FormEvent } from 'react'
import styles from './login.module.scss'
import { Container, TextField, Button } from '@material-ui/core'
import Head from '../../head'

interface InputHandlers {
  handleUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

interface LoginProps {
  login: (event: React.FormEvent<HTMLFormElement>) => void
  username: string
  password: string
  inputHandlers: InputHandlers
}

const LoginForm = ({
  login,
  username,
  password,
  inputHandlers,
}: LoginProps) => {
  return (
    <>
      <Head title="log in" />
      <form className={styles.login} onSubmit={login}>
        <Container maxWidth="sm">
          <div>
            <h2>log in.</h2>
            <TextField
              required
              className={styles.textField}
              label="username"
              variant="outlined"
              size="small"
              value={username}
              onChange={inputHandlers.handleUsernameChange}
            />
            <TextField
              required
              className={styles.textField}
              label="password"
              variant="outlined"
              size="small"
              type="password"
              value={password}
              onChange={inputHandlers.handlePasswordChange}
            />
            <Button
              className={styles.button}
              type="submit"
              variant="contained"
              color="primary"
            >
              Log In
            </Button>
          </div>
        </Container>
      </form>
    </>
  )
}

export default LoginForm
