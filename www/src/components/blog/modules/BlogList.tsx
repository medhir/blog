import React from 'react'
import PostsList from './PostsList'

import { PostMetadata, DraftMetadata } from '../types'
import styles from '../blog.module.scss'

interface BlogListProps {
  posts: Array<PostMetadata>
  drafts?: Array<DraftMetadata>
}

const BlogList = ({ posts }: BlogListProps) => {
  return (
    <section className={styles.blog}>
      <PostsList posts={posts} />
    </section>
  )
}

export default BlogList
