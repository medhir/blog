import React from 'react'
import PropTypes from 'prop-types'
import PostsList from './modules/PostsList'
import './blog.css'

const Blog = ({ posts }) => {
  return (
    <section className="blog">
      <PostsList posts={posts} />
    </section>
  )
}

Blog.propTypes = {
  posts: PropTypes.array,
}

export default Blog
