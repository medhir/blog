import React, { FormEvent } from 'react'
import styles from './login.module.scss'

interface LoginProps {
  login: (event: FormEvent<HTMLElement>) => void
}

const Login = ({ login }: LoginProps) => {
  return (
    <section className={styles.login} onSubmit={login}>
      <form>
        <div className={styles.text_input}>
          <label htmlFor="loginusername">Username or Email</label>
          <input
            type="text"
            placeholder="Enter username"
            id="loginusername"
            name="username"
            required
          />
        </div>
        <div className={styles.text_input}>
          <label htmlFor="loginpassword">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            id="loginpassword"
            name="password"
            required
          />
        </div>
        <button type="submit">Log In</button>
      </form>
    </section>
  )
}

export default Login
