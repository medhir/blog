import React, { Component, Fragment } from 'react';
import { fusionAuthUtility } from '../fusionAuth'

class Auth extends Component {
    constructor (props) {
        super(props);
        this.state = {
            response: null 
        }
    }

    createMedhir = () => {
        const medhir = {
        }
        fusionAuthUtility.createMedhir(medhir).then((response) => {
            this.setState({
                response: response
            })
        })
    }

    render () {
        if (this.state.response) {
            return (
                <section className="create">
                    <pre>{ this.state.response }</pre>
                </section>
            )
        }
        return (
            <section className="create">
                <button onClick={ this.createMedhir } >Create Medhir</button>
            </section>
        )
    }
}

export default Auth;