import React, { Component, Fragment } from 'react';
import Marked from 'marked';
import uuid from 'uuid/v4';
import Markdown from './Markdown';
import PopplersMarkdown from '../Blog/popplers'
import Preview from './Preview';
import Controls from './Controls'; 
import { AuthUtil } from '../../Auth/AuthUtility'
import api from './api'
import './Editor.css';

class Editor extends Component {
    constructor (props) {
        super(props)
        this.editorRef = React.createRef()
        this.state = {
            isMobile: window.innerWidth <= 600 ? true : false
        }

        if (this.props.draft) {
            this.state.new = false
            this.state.edit = false
            this.state.id = props.draft.id
        } else {
            this.state.new = true
            this.state.edit = true
            this.state.markdown = PopplersMarkdown 
            this.state.id = uuid()
        }
    }

    saveDraft = () => {
        const draft = {
            title: this.getTitle(), 
            saved: new Date().getTime(), 
            markdown: this.state.markdown, 
            id: this.state.id 
        }

        const handleSuccess = (success) => {
            this.setState({
                draft: draft, 
                edit: false
            })
            // Set parent state
            this.props.handleSave()
        }
        
        if (this.state.new) {
            api.newDraft(draft, AuthUtil.authorizationHeader).then(handleSuccess)
        } else {
            api.saveDraft(draft, AuthUtil.authorizationHeader).then(handleSuccess)
        }
    }

    getTitle = () => {
        // grab the first h1 tag present in the article preview and return its innerText
        const article = document.createElement('article')
        article.innerHTML = this.state.parsed
        const heading = article.querySelector('h1')
        
        if (heading) {
            return heading.innerText
        } else {
            return 'Untitled'
        }
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
        if (!this.state.new) {
            api.getDraft(this.state.id, AuthUtil.authorizationHeader).then(response => {
                const draft = response.data
                this.setState({
                    markdown: draft.markdown, 
                    parsed: Marked(draft.markdown)
                })
            })
        } else {
            this.setState({
                parsed: Marked(this.state.markdown)
            })
        }
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