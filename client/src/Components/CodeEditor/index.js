import React, { Component } from 'react'
import CodeMirror from './CodeMirror'
import MDXView from './MDXView'
import debounce from '../../Utils/debounce'
import './CodeEditor.css'

class CodeEditor extends Component {
    constructor (props) {
        super(props)
        this.state = {
            mdx: this.props.mdx,
            mdxToParse: this.props.mdx
        }
    }

    updateMDX (newMDX) {
        this.setState({
            mdx: newMDX
        })
    }

    updateMDXToParse () {
        this.setState({
            mdxToParse: this.state.mdx
        })
    }

    render () {
        return (
            <section className="codeEditor">
                <CodeMirror value={ this.state.mdx } onChange={ this.updateMDX.bind(this) } parse={ this.updateMDXToParse.bind(this) } />
                <MDXView mdx={ this.state.mdxToParse } />
            </section>
        )
    }
}

export default CodeEditor