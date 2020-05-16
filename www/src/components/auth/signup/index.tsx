import React, { useState } from 'react'
import { TextField, Button, Container } from '@material-ui/core'
import styles from './signup.module.scss'
import Head from '../../head'
import http from '../../../utility/http'
import { AxiosError } from 'axios'
import Router from 'next/router'
import { ErrorAlert } from '../../alert'

interface SubmitErrorAlert {
  open: boolean
  message: string
}

const SignUpForm = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState(false)
  const [confirmPasswordHelperText, setConfirmPasswordHelperText] = useState('')
  const [submitErrorAlert, setSubmitErrorAlert] = useState({
    open: false,
    message: '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password != confirmPassword) {
      setConfirmPasswordError(true)
      setConfirmPasswordHelperText('the passwords entered do not match!')
      return
    }
    http
      .Post('/register', {
        first_name: firstName,
        last_name: lastName,
        username: username,
        email: email,
        password: password,
      })
      .then(() => {
        Router.replace('/signup', '/', { shallow: true })
      })
      .catch((error: AxiosError) => {
        setSubmitErrorAlert({
          open: true,
          message: String(error.response.data),
        })
      })
  }

  const updateFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFirstName(value)
  }

  const updateLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLastName(value)
  }

  const updateUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUsername(value)
  }

  const updateEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
  }

  const updatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
  }

  const updateConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setConfirmPassword(value)
  }

  const handleSubmitAlertClose = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return
    }

    setSubmitErrorAlert({
      open: false,
      message: '',
    })
  }

  return (
    <>
      <Head title="sign up" />
      <section className={styles.signup}>
        <Container maxWidth="sm">
          <form onSubmit={handleSubmit}>
            <h2>start learning.</h2>
            <TextField
              required
              className={styles.textField}
              label="first name"
              variant="outlined"
              size="small"
              value={firstName}
              onChange={updateFirstName}
            />
            <TextField
              required
              className={styles.textField}
              label="last name"
              variant="outlined"
              size="small"
              value={lastName}
              onChange={updateLastName}
            />
            <TextField
              required
              className={styles.textField}
              label="username"
              variant="outlined"
              size="small"
              value={username}
              onChange={updateUsername}
            />
            <TextField
              required
              className={styles.textField}
              label="email address"
              variant="outlined"
              size="small"
              type="email"
              value={email}
              onChange={updateEmail}
            />
            <TextField
              required
              className={styles.textField}
              label="password"
              variant="outlined"
              size="small"
              type="password"
              value={password}
              onChange={updatePassword}
            />
            <TextField
              required
              className={styles.textField}
              label="confirm password"
              variant="outlined"
              size="small"
              type="password"
              value={confirmPassword}
              onChange={updateConfirmPassword}
              helperText={confirmPasswordHelperText}
              error={confirmPasswordError}
            />
            <Button
              className={styles.button}
              variant="contained"
              color="primary"
              type="submit"
            >
              Sign Up
            </Button>
            {submitErrorAlert.open && (
              <ErrorAlert
                open={submitErrorAlert.open}
                onClose={handleSubmitAlertClose}
              >
                {`there was an issue registering your account - ${submitErrorAlert.message}`}
              </ErrorAlert>
            )}
          </form>
        </Container>
      </section>
    </>
  )
}

export default SignUpForm
