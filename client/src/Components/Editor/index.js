import React, { Component, Fragment } from 'react'
import Marked from 'marked'
import uuid from 'uuid/v4'

import Auth from 'Auth'
import { AuthUtil } from 'Auth/AuthUtility'
import PopplersMarkdown from 'Components/Blog/popplers'

import Markdown from './Markdown'
import Preview from './Preview'
import Controls from './Controls'
import api from './api'
import './Editor.css'
import './Article.css'

class Editor extends Component {
  constructor(props) {
    super(props)
    this.editorRef = React.createRef()
    this.state = {
      isMobile: window.innerWidth <= 600 ? true : false,
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
    let wasNew = this.state.new ? true : false
    const draft = {
      title: this.getTitle(),
      saved: new Date().getTime(),
      markdown: this.state.markdown,
      id: this.state.id,
    }

    const handleSuccess = () => {
      this.setState(
        {
          draft: draft,
          new: false,
          edit: false,
        },
        () => {
          // Set parent state
          this.props.handleUpdate()
          if (wasNew) {
            this.props.history.push({
              pathname: `/blog/edit/draft/${this.state.id}`,
              state: draft,
            })
          }
        }
      )
    }

    api.saveDraft(draft, AuthUtil.authorizationHeader).then(handleSuccess)
  }

  handleDelete() {
    this.props.handleUpdate()
    this.props.history.push('/blog/edit')
  }

  publish = () => {
    const title = this.getTitle()
    const titlePath = this.getTitlePath(title)
    const post = {
      title: title,
      titlePath: titlePath,
      published: new Date().getTime(),
      markdown: this.state.markdown,
      id: this.state.id,
    }
    api.publish(post, AuthUtil.authorizationHeader).then(() => {
      this.setState({ published: true })
    })
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

  getTitlePath = title => {
    let path = title.replace(/\W/g, '-')
    path = path.toLowerCase()
    return path
  }

  openEditor = () => {
    this.setState({
      edit: true,
    })
  }

  parseMarkdown = e => {
    this.setState({
      markdown: e.target.value,
      parsed: Marked(e.target.value),
    })
  }

  updateMarkdown(md, cb) {
    this.setState(
      {
        markdown: md,
        parsed: Marked(md),
      },
      cb
    )
  }

  componentDidMount() {
    if (!this.state.new) {
      api
        .getDraft(this.state.id, AuthUtil.authorizationHeader)
        .then(response => {
          const draft = response.data
          this.setState({
            markdown: draft.markdown,
            parsed: Marked(draft.markdown),
          })
        })
    } else {
      this.setState({
        parsed: Marked(this.state.markdown),
      })
    }
  }

  render() {
    // local variables
    const editorClasses = `editor ${this.state.edit ? '' : 'preview'}`
    // local components
    const markdown = (
      <Markdown
        markdown={this.state.markdown}
        parse={this.parseMarkdown}
        updateMarkdown={this.updateMarkdown.bind(this)}
        id={this.state.id}
      />
    )
    const preview = <Preview parsedContent={this.state.parsed} />
    const controls = (
      <Controls
        edit={this.state.edit}
        deleteURI={`/api/blog/draft/${this.state.id}`}
        deleteCallback={this.handleDelete.bind(this)}
        saveDraft={this.saveDraft.bind(this)}
        openEditor={this.openEditor.bind(this)}
        publish={this.publish.bind(this)}
      />
    )

    // layouts
    const mobileLayout = (
      <Fragment>
        {this.state.edit ? markdown : preview}
        {controls}
      </Fragment>
    )
    const desktopLayout = (
      <Fragment>
        {markdown}
        {preview}
        {controls}
      </Fragment>
    )
    // render layout
    return (
      <Auth withLoginPrompt>
        <section ref={this.editorRef} className={editorClasses}>
          {this.state.isMobile ? mobileLayout : desktopLayout}
        </section>
      </Auth>
    )
  }
}

export default Editor
