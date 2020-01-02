import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Marked from 'marked'
import api from 'Components/Blog/api'
import Loading from 'Components/Loading'
import './Post.css'

const Display = props => {
  const generateHTML = () => {
    return {
      __html: props.parsedContent,
    }
  }
  return (
    <section className="display">
      <article dangerouslySetInnerHTML={generateHTML()} />
    </section>
  )
}

Display.propTypes = {
  parsedContent: PropTypes.string,
}

class Post extends Component {
  constructor(props) {
    super(props)
    this.state = {
      post: null,
    }
  }

  componentDidMount = () => {
    api.getPost(this.props.match.params.titlePath).then(response => {
      this.setState({ post: response.data })
    })
  }

  render() {
    if (this.state.post) {
      const parsed = Marked(this.state.post.markdown)
      return <Display parsedContent={parsed} />
    } else {
      return <Loading />
    }
  }
}

Post.propTypes = {
  match: PropTypes.object,
}

export default Post
