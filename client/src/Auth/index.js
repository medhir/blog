import React, { Component, Fragment } from 'react'
import Login from './Login'
import api from './api'
import { AuthUtil } from './AuthUtility'


class Auth extends Component {
    constructor (props) {
        super(props)
        this.state = {
            auth: null,
            authed: AuthUtil.authed,
            error: null
        }
    }

    login = (e) => {
        e.preventDefault()
        const credentials = {
            loginId: e.target[0].value,
            password: e.target[1].value
        }
        // Do the login 
        api.login(credentials)
        // Set the authentication
        .then(response => {
            if (response.status = 200) {
                AuthUtil.setAuth(response.data)
                this.setState({
                    auth: response.data, 
                    authed: AuthUtil.authed
                })
            } else {
                this.setState({
                    error: response
                })
            }
        })
        // Handle any errors
        .catch(error => {
            this.setState({
                error: error
            })
        })
    }

    render () {
        const login = <Login login={ this.login }/>
        if (this.state.authed) {
            return (this.props.children)
        } else if (this.state.error) {
            return (
                <Fragment>
                    { login }
                    <p>Login failed with status code { this.state.error.response.status }</p>
                </Fragment>
            )
        } else {
            return login
        }
    }
}

export default Auth