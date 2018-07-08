import React from 'react';

const BlogPost = (props) => {
    return (
        <li className="post">
            <h3>{ props.post.title }</h3>
            <h4>{ props.post.subtitle}</h4>
            <p>{ props.post.date }</p>
        </li>
    )
};

export default BlogPost;