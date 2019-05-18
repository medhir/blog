import React, { Component } from 'react'
import MDX from '@mdx-js/runtime'

const Greeting = (props) => <p>{ `Hello, ${ props.name }` }</p>

const components = {
    Greeting: Greeting
}

class MDXView extends Component {
    render () {
        return (
            <div className="mdxView">
                <MDX components={ components }>{ this.props.mdx }</MDX>
            </div>
        )
    }
}

export default MDXView