import React from 'react'
import PropTypes from 'prop-types'

const PostListItem = props => {
  const publishedDate = new Date(props.post.published).toDateString()
  return (
    <li className="post">
      <a href={`/blog/post/${props.post.titlePath}`} key={props.post.id}>
        <h3>{props.post.title}</h3>
        <p>{publishedDate}</p>
      </a>
    </li>
  )
}

PostListItem.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string,
    markdown: PropTypes.string,
    published: PropTypes.number,
    title: PropTypes.string,
    titlePath: PropTypes.string,
  }),
}

export default PostListItem
