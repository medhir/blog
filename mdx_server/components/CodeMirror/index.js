import React, { Component } from 'react'
import CodeMirrorBase from 'react-codemirror'

import 'codemirror/lib/codemirror.css'
import 'code-mirror-themes/themes/coda.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/jsx/jsx'
import 'codemirror/mode/xml/xml'
import 'codemirror/addon/selection/active-line'

import './cm.css'

const cmOptions = {
    lineNumbers: true, 
    mode: 'javascript', 
    addModeClass: true,
    theme: 'coda',
    lineWrapping: true, 
    styleActiveLine: {
        nonEmpty: true
    },
    styleActiveSelected: true
}

class CodeMirror extends Component {
    render () {
        return <CodeMirrorBase value={ this.props.value } options={ cmOptions } onChange={ this.props.onChange } />;
    }
}

export default CodeMirror
