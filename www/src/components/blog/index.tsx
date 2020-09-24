import React from 'react'
import PostsList from './modules/PostsList'
import styles from './blog.module.scss'
import DraftsList from './modules/DraftsList'

interface BlogProps {
  posts: Array<PostMetadata>
  drafts?: Array<PostMetadata>
}

export interface PostMetadata {
  id: string
  title: string
  slug: string
  markdown: string
  created_on: string
  saved_on?: string
  published_on?: string
  revised_on: string
}

const Blog = ({ posts, drafts }: BlogProps) => {
  return (
    <section className={styles.blog}>
      <PostsList posts={posts} />
      {drafts && <DraftsList drafts={drafts} />}
    </section>
  )
}

export default Blog
