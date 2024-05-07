import React from 'react'
import PropTypes from 'prop-types'
import PostListItem from './PostListItem'

const PostsList = props => {
  if (props.posts === null) return null
  const posts = props.posts.map(post => {
    return <PostListItem post={post} key={post.id} />
  })

  return <ul className="posts">{posts}</ul>
}

PostsList.propTypes = {
  posts: PropTypes.array,
}

export default PostsList
