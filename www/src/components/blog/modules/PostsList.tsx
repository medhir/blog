import React from 'react'

import Link from 'next/link'

import styles from '../blog.module.scss'
import { PostMetadata } from '..'

interface PostListItemProps {
  post: PostMetadata
}

const PostListItem = ({ post }: PostListItemProps) => {
  const publishedDate = new Date(post.published_on).toDateString()
  return (
    <li className={styles.post}>
      <Link href={`/blog/${post.slug}`} key={post.id}>
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
