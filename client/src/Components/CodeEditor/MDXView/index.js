import React, { Component } from 'react'
import { mdx } from 'mdx.macro'
import MDX from '@mdx-js/runtime'
import { MDXProvider } from '@mdx-js/react';

class MDXView extends Component {
    constructor (props) {
        super(props)
        this.state = {
            error: null
        }
    }

    componentDidCatch(error) {
        console.dir(error)
        this.setState({
            error: error
        })
    }

    componentDidUpdate (prevProps) {
        if (prevProps.mdx !== this.props.mdx) {
            this.setState({
                error: null
            })
        }
    }

    render () {
        return (
            <div className="mdxView">
                { this.state.error ? <pre className="mdxError">{ this.state.error.toString() }</pre> : <MDX>{ this.props.mdx }</MDX> }
            </div>
        )
    }
}

export default MDXView