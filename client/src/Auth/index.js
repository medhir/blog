import React, { Component, Fragment } from 'react'
import Login from './Login'
import api from './api'
import { AuthUtil } from './AuthUtility'


class Auth extends Component {
    constructor (props) {
        super(props)
        this.state = {
            auth: AuthUtil.auth,
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
                    error: response.data
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

    componentDidMount = () => {
        if (this.state.auth) {
            AuthUtil.checkExpiry().then(() => {
                this.setState({
                    auth: AuthUtil.auth
                })
            })
        }
    }

    render () {
        const login = <Login login={ this.login }/>
        if (this.state.auth) {
            return (this.props.children)
        } else if (this.state.error && this.props.withLoginPrompt) {
            return (
                <Fragment>
                    { login }
                    <p>Login failed</p>
                    <pre>{ JSON.stringify(this.state.error) }</pre>
                </Fragment>
            )
        } else if (this.props.withLoginPrompt) {
            return login
        } else {
            return null
        }
    }
}

export default Auth