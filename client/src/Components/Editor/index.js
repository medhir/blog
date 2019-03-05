import React, { Component, Fragment } from 'react';
import Marked from 'marked';
import uuid from 'uuid/v4';
import Markdown from './Markdown';
import Preview from './Preview';
import Controls from './Controls'; 
import api from './api'
import './Editor.css';

class Editor extends Component {
    constructor (props) {
        super(props)
        this.editorRef = React.createRef()
        this.state = {
            markdown: props.markdown,
            id: this.props.id || null,
            edit: true, 
            isMobile: window.innerWidth <= 600 ? true : false
        }
    }

    saveDraft = () => {
        const draft = {
            title: this.getTitle(), 
            markdown: this.state.markdown
        }

        if (this.state.id) {
            draft.id = this.state.id
        } else {
            draft.id = uuid()
        }
        
        api.saveDraft(draft).then((success) => {
            console.log(success)
            this.setState({
                draft: draft, 
                edit: false
            })
        })
    }

    getTitle = () => {
        // grab the first h1 tag present in the article preview and return its innerText
        const header = this.editorRef.current.querySelector('article > h1')
        return header.innerText || 'Untitled'
    }

    openEditor = () => {
        this.setState({
            edit: true
        })
    }

    parseMarkdown = (e) => {
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
        const editorClasses = `editor ${ this.state.edit ? '' : 'preview' }`;
        // local components
        const markdown = <Markdown markdown={ this.state.markdown } parse={ this.parseMarkdown } />;
        const preview = <Preview parsedContent={ this.state.parsed } />;
        const controls = <Controls edit={ this.state.edit } saveDraft={ this.saveDraft.bind(this) } openEditor={ this.openEditor.bind(this) } />;
        // layouts
        const mobileLayout = (
            <Fragment>
                {   
                    this.state.edit 
                    ? markdown 
                    : preview
                }
                { controls }
            </Fragment>
        );
        const desktopLayout = (
            <Fragment>
                { markdown }
                { preview }
                { controls }
            </Fragment>
        );
        // render layout
        return (
            <section ref={ this.editorRef } className={ editorClasses }>
                { this.state.isMobile ? mobileLayout : desktopLayout }
            </section>
        )
    }
}

export default Editor;