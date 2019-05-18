import React, { Component } from 'react'
import CodeMirrorBase from 'react-codemirror'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/blackboard.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/xml/xml'
import 'codemirror/addon/selection/active-line'

import './cm.css'

const cmOptions = {
    lineNumbers: true, 
    mode: 'markdown', 
    addModeClass: true,
    theme: 'blackboard',
    lineWrapping: true, 
    styleActiveLine: {
        nonEmpty: true
    },
    styleActiveSelected: true
}

class CodeMirror extends Component {
    render () {
        return (
        <div className="textEditor">
            <CodeMirrorBase value={ this.props.value } options={ cmOptions } onChange={ this.props.onChange } />
        </div>
        )
    }
}

export default CodeMirror