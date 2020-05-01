import React, { useEffect, useState } from 'react'

import { PostMetadata } from './types'
import PostsList from './modules/PostsList'
import styles from './blog.module.scss'
import http from '../../utility/http'
import DraftsList from './modules/DraftsList'

interface BlogProps {
  posts: Array<PostMetadata>
  withDrafts?: boolean
}

const Blog = ({ posts, withDrafts }: BlogProps) => {
  const [drafts, setDrafts] = useState(null)
  if (withDrafts) {
    useEffect(() => {
      http.Get('/blog/drafts', { withCredentials: true }).then((response) => {
        setDrafts(response.data)
      })
    }, [])
  }
  return (
    <section className={styles.blog}>
      <PostsList posts={posts} />
      {withDrafts && <DraftsList drafts={drafts} />}
    </section>
  )
}

export default Blog
