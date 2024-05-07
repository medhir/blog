import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const AddPost = props => {
  return (
    <Link to={`${props.match.path}/new/draft`}>
      <button className="addPost">New Post</button>
    </Link>
  )
}

AddPost.propTypes = {
  match: PropTypes.object,
}

export default AddPost
