import React, { Component, Fragment } from 'react';
import AuthHelpers from './authHelpers';

const CodeForm = (props) => (
    <Fragment>
        <input id="verificationCode" type="text" placeholder="Enter code" />
        <button onClick={ props.login }>Login</button>
    </Fragment>
)

class Login extends Component {
    constructor (props) {
        super(props);
        this.state = {
            codeRequested: false
        }
    }

    handleRequest = () => {
        this.setState({
            codeRequested: true
        })
        AuthHelpers.sendText();
    }

    handleLogin= (e) => {
        e.preventDefault();
        const code = document.getElementById('verificationCode').value;
        AuthHelpers.login(code);
    }

    render () {
        return (
            <section className="login">
                {
                    !this.state.codeRequested
                    ? <button onClick={ this.handleRequest }>Request Code</button>
                    : <CodeForm login={ this.handleLogin } />
                }
            </section>
        )
    }
}

export default Login;