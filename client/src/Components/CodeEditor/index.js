import React, { Component } from 'react'
import CodeMirror from './CodeMirror'
import MDXView from './MDXView'
import './CodeEditor.css'

class CodeEditor extends Component {
    constructor (props) {
        super(props)
        this.state = {
            mdx: this.props.mdx
        }
    }

    updateMdx (newMdx) {
        this.setState({
            mdx: newMdx
        })
    }

    render () {
        return (
            <section className="codeEditor">
                <CodeMirror value={ this.state.mdx } onChange={ this.updateMdx.bind(this) } />
                <MDXView mdx={ this.state.mdx } />
            </section>
        )
    }
}

export default CodeEditor