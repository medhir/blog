import React, { Component } from 'react'
import axios from 'axios'
import uuid from 'uuid/v4'
import CodeMirror from './CodeMirror'
import MDXView from './MDXView'
import PopplerMarkdown from '../Blog/popplers'
import './CodeEditor.css'

class CodeEditor extends Component {
    constructor (props) {
        const mdx = props.mdx || PopplerMarkdown
        super(props)
        this.state = {
            mdx: mdx,
            uuid: uuid(),
            parsing: false,
            parsedUrl: null
        }
    }

    updateMDX (newMDX) {
        this.setState({
            mdx: newMDX
        })
    }

    updateParsed () {
        this.setState({
            parsing: true
        }, () => {
            axios.post(`http://localhost:6789/mdx/${this.state.uuid}`, { mdx: this.state.mdx })
            .then(() => { 
                this.setState({ 
                    parsedUrl: `http://localhost:6789/mdx/${this.state.uuid}`, 
                    parsing: false
                }) 
            })
        })
    }

    render () {
        return (
            <section className="codeEditor">
                <CodeMirror 
                    value={ this.state.mdx } 
                    onChange={ this.updateMDX.bind(this) } 
                    parse={ this.updateParsed.bind(this) } 
                    parsing={ this.state.parsing } 
                />
                { this.state.parsedUrl && <MDXView url={ this.state.parsedUrl } /> }
            </section>
        )
    }
}

export default CodeEditor