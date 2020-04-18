import React from 'react'
import PropTypes from 'prop-types'
import PostsList from './PostsList'

const BlogList = (props) => {
  return (
    <section className="blog">
      <PostsList posts={props.posts} />
    </section>
  )
}

BlogList.propTypes = {
  drafts: PropTypes.array,
  posts: PropTypes.array,
  match: PropTypes.object,
}

export default BlogList
