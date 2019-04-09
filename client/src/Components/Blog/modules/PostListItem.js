import React from 'react';

const PostListItem = (props) => {
    const publishedDate = new Date(props.post.published).toDateString()
    return (
        <li className="post">
            <h3>{ props.post.title }</h3>
            { props.post.subtitle &&  <h4>{ props.post.subtitle}</h4> }
            <p>{ publishedDate }</p>
        </li>
    )
};

export default PostListItem;