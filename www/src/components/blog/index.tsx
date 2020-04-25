import React from 'react'

import { PostMetadata } from './types'
import PostsList from './modules/PostsList'
import styles from './blog.module.scss'

interface BlogProps {
  posts: Array<PostMetadata>
}

const Blog = ({ posts }: BlogProps) => {
  return (
    <section className={styles.blog}>
      <PostsList posts={posts} />
    </section>
  )
}

export default Blog
