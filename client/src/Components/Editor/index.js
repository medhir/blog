import React, { Component } from 'react';
import Marked from 'marked';
import Markdown from './Markdown';
import Preview from './Preview';
import Controls from './Controls'; 
import { Types } from '../../Controls/Button';
import './Editor.css';

class Editor extends Component {
    constructor (props) {
        super(props);
        this.state = {
            markdown: props.markdown,
            edit: true, 
            type: Types.save,
            isMobile: window.innerWidth <= 600 ? true : false
        }
    }

    handleClick = () => {
        if (this.state.edit === true) {
            localStorage.setItem('medhir-markdown', this.state.markdown);
        }

        this.setState(prevState => ({
            edit: !prevState.edit,
            type: !prevState.edit ? Types.save : Types.edit
        }));
    }

    handleWindowResize = () => {
        this.setState({ width: window.innerWidth });
    }

    parseMarkdown = (e) => {
        this.setState({
            markdown: e.target.value,
            parsed: Marked(e.target.value)
        })
    }

    componentDidMount () {
        window.addEventListener('resize', this.handleWindowResize)
        const localMd = localStorage.getItem('medhir-markdown');
        this.setState({
            parsed: localMd ? Marked(localMd) : Marked(this.state.markdown)
        })
    }

    render () {
        // local variables
        const localStorageMd = localStorage.getItem('medhir-markdown');
        const className = `editor ${ this.state.edit ? null : 'preview' }`;

        // components
        const markdown = <Markdown markdown={ localStorageMd ? localStorageMd : this.state.markdown} parse={this.parseMarkdown} />;
        const preview = <Preview parsedContent={ this.state.parsed } />;
        const controls = <Controls edit={ this.state.edit } type={ this.state.type } onClick={ this.handleClick } />;

        // layout 
        const mobileLayout = (
            <section className={ className }>
                {   
                    this.state.edit 
                    ? markdown 
                    : preview
                }
                { controls }
            </section>
        );

        const desktopLayout = (
            <section className={ `editor ${ this.state.edit ? null : 'preview' }` }>
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