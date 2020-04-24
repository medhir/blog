import React from 'react'
import PropTypes from 'prop-types'
import Marked from 'marked'

import './article.css'

const Display = ({ parsedContent }) => {
  const generateHTML = () => {
    return {
      __html: parsedContent,
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

const Post = ({ markdown }) => <Display parsedContent={Marked(markdown)} />

export default Post
