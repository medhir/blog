import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import { PostMetadata } from '../types'
import styles from '../blog.module.scss'

interface PostListItemProps {
  post: PostMetadata
}

const PostListItem = ({ post }: PostListItemProps) => {
  const publishedDate = new Date(post.published).toDateString()
  return (
    <li className={styles.post}>
      <Link href={`/blog/${post.titlePath}`} key={post.id}>
        <a>
          <h3>{post.title}</h3>
          <p>{publishedDate}</p>
        </a>
      </Link>
    </li>
  )
}

interface PostsListProps {
  posts: Array<PostMetadata>
}

const PostsList = ({ posts }: PostsListProps) => {
  if (posts === null) return null
  const postListItems = posts.map((post) => {
    return <PostListItem post={post} key={post.id} />
  })

  return <ul className={styles.posts}>{postListItems}</ul>
}

export default PostsList
