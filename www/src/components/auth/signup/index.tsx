import React, { useState } from 'react'
import { TextField, Button, Container } from '@material-ui/core'
import styles from './signup.module.scss'

const SignUpForm = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState(false)
  const [confirmPasswordHelperText, setConfirmPasswordHelperText] = useState('')

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if (password != confirmPassword) {
      setConfirmPasswordError(true)
      setConfirmPasswordHelperText('the passwords entered do not match!')
    }
  }

  const handleUpdatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
  }

  const handleUpdateConfirmPassword = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value
    setConfirmPassword(value)
  }

  return (
    <section className={styles.signup}>
      <Container maxWidth="sm">
        <div>
          <h2>start learning.</h2>
          <TextField
            required
            className={styles.textField}
            label="username"
            variant="outlined"
            size="small"
          />
          <TextField
            required
            className={styles.textField}
            label="email address"
            variant="outlined"
            size="small"
            type="email"
          />
          <TextField
            required
            className={styles.textField}
            label="password"
            variant="outlined"
            size="small"
            type="password"
            value={password}
            onChange={handleUpdatePassword}
          />
          <TextField
            required
            className={styles.textField}
            label="confirm password"
            variant="outlined"
            size="small"
            type="password"
            value={confirmPassword}
            onChange={handleUpdateConfirmPassword}
            helperText={confirmPasswordHelperText}
            error={confirmPasswordError}
          />
          <Button
            className={styles.button}
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Sign Up
          </Button>
        </div>
      </Container>
    </section>
  )
}

export default SignUpForm
