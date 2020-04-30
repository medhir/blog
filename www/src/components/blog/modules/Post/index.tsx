import React from 'react'

import styles from './article.module.scss'
import MDXViewer from '../../../mdx-viewer'

interface PostProps {
  source: any
}

const Post = ({ source }: PostProps) => (
  <section>
    <article className={styles.article}>
      <MDXViewer source={source} />
    </article>
  </section>
)

export default Post
