import React from 'react'
import { Link } from 'react-router-dom'

const AddPost = (props) => {
    return (
        <Link to={ `${ props.match.path }/drafts/new` }>
            <button className="addPost">New Post</button>
        </Link>
    )
}

export default AddPost