import React, { Component } from 'react';
import Marked from 'marked';
import Markdown from './Markdown';
import Preview from './Preview';
import Controls from './Controls'; 
import api from './api'
import './Editor.css';

class Editor extends Component {
    constructor (props) {
        super(props);
        this.state = {
            markdown: props.markdown,
            edit: true, 
            isMobile: window.innerWidth <= 600 ? true : false
        }
    }

    saveDraft = () => {
        // post draft 
        api.saveDraft({}).then(draft => {
            this.setState({
                draft: draft, 
                edit: false
            })
        })
    }

    parseMarkdown = (e) => {
        debugger
        this.setState({
            markdown: e.target.value,
            parsed: Marked(e.target.value)
        })
    }

    componentDidMount () {
        this.setState({
            parsed: Marked(this.state.markdown)
        })
    }

    render () {
        // local variables
        const editorClasses = `editor ${ this.state.edit ? null : 'preview' }`;
        // components
        const markdown = <Markdown markdown={ this.state.markdown } parse={ this.parseMarkdown } />;
        const preview = <Preview parsedContent={ this.state.parsed } />;
        const controls = <Controls edit={ this.state.edit } onClick={ this.handleClick } />;
        // layout 
        const mobileLayout = (
            <section className={ editorClasses }>
                {   
                    this.state.edit 
                    ? markdown 
                    : preview
                }
                { controls }
            </section>
        );
        const desktopLayout = (
            <section className={ editorClasses }>
                { markdown }
                { preview }
                { controls }
            </section>
        );
        // render layout
        return this.state.isMobile ? mobileLayout : desktopLayout;
    }
}

export default Editor;