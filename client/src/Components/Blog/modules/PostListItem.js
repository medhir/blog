import React from 'react';
import { Link } from 'react-router-dom'

const PostListItem = (props) => {
    const publishedDate = new Date(props.post.published).toDateString()
    return (
        <li className="post">
            <Link to={{
                pathname: `/blog/post/${ props.post.titlePath }`,
                state: props.post.titlePath
            }} key={ props.post.id }>
                <h3>{ props.post.title }</h3>
                { props.post.subtitle &&  <h4>{ props.post.subtitle}</h4> }
                <p>{ publishedDate }</p>
            </Link>
        </li>
    )
};

export default PostListItem;