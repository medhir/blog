import React from 'react'
import Marked from 'marked'

import styles from './article.module.scss'

interface DisplayProps {
  parsedContent: string
}

const Display = ({ parsedContent }: DisplayProps) => {
  const generateHTML = () => {
    return {
      __html: parsedContent,
    }
  }
  return (
    <section>
      <article
        className={styles.article}
        dangerouslySetInnerHTML={generateHTML()}
      />
    </section>
  )
}

interface PostProps {
  markdown: string
}

const Post = ({ markdown }: PostProps) => (
  <Display parsedContent={Marked(markdown)} />
)

export default Post
