import React, { Component } from 'react';
import { Link } from 'react-router-dom'; 
import BlogPost from './BlogPost';
import './Blog.css';

const BlogPosts = (props) => {
    const posts = props.posts.map(post => {
        return <BlogPost post={ post } />
    });

    return <ul className="posts">{ posts }</ul>
}

const AddPost = () => {
    return <Link to="/editor">Add a new post</Link>;
}

class Blog extends Component {
    constructor (props) {
        super(props);   
        this.state = {
            posts: [
                {
                    title: "Barp",
                    subtitle: "Beeerp",
                    date: new Date().toDateString()
                }, 
                {
                    title: "Darp",
                    subtitle: "Deeerp",
                    date: new Date().toDateString()
                }
            ]
        }
    }
    render () {
        return (
        <section className="blog">
            <BlogPosts posts={ this.state.posts } />
            <AddPost />
        </section>
        );
    }
}

export default Blog;