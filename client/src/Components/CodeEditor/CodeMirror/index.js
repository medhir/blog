import React, { Component } from 'react'
import CodeMirrorBase from 'react-codemirror'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/duotone-light.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/jsx/jsx'
import 'codemirror/mode/xml/xml'
import 'codemirror/addon/selection/active-line'

import './cm.css'
import { GreenButton } from '../../../Controls/Buttons';

const cmOptions = {
    lineNumbers: true, 
    mode: 'markdown', 
    addModeClass: true,
    theme: 'duotone-light',
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
            <GreenButton onClick={ this.props.parse } parsing={ this.props.parsing }>{ this.props.parsing ? 'Running...' : 'Run' }</GreenButton>
        </div>
        )
    }
}

export default CodeMirror