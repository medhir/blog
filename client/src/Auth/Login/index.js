import React, { Component } from 'react'
import './Login.css'

class Login extends Component {
  render() {
    return (
      <section className="login" onSubmit={this.props.login}>
        <form>
          <div className="username">
            <label htmlFor="loginusername">Username or Email</label>
            <input
              type="text"
              placeholder="Enter username"
              id="loginusername"
              name="username"
              required
            />
          </div>
          <div className="password">
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
}

export default Login
