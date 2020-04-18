import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

const PostListItem = (props) => {
  const publishedDate = new Date(props.post.published).toDateString()
  return (
    <li className="post">
      <Link to={`/blog/${props.post.titlePath}`} key={props.post.id}>
        <h3>{props.post.title}</h3>
        <p>{publishedDate}</p>
      </Link>
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

const PostsList = (props) => {
  if (props.posts === null) return null
  const posts = props.posts.map((post) => {
    return <PostListItem post={post} key={post.id} />
  })

  return <ul className="posts">{posts}</ul>
}

PostsList.propTypes = {
  posts: PropTypes.array,
}

export default PostsList
