import React, { Component } from 'react';
import Editor from '../Editor';
import BlogPost from './BlogPost';
import './Blog.css';

const BlogPosts = (props) => {
    const posts = props.posts.map(post => {
        return <BlogPost post={ post } />
    });

    return <ul className="posts">{ posts }</ul>
}

const AddPost = (props) => {
    return <button onClick={ props.onClick }>Add a post</button>;
}

const md = 
`# DELETE YOUR FACEBook
## Please`;

const editor = <Editor markdown={ md } />;

class Blog extends Component {
    constructor (props) {
        super(props);   
        this.state = {
            add: false,
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

    handleAddPost = (e) => {
        this.setState({
            add: true
        });
    }

    render () {
        if (this.state.add) {
            return editor;
        }
        return (
        <section className="blog">
            <BlogPosts posts={ this.state.posts } />
            <AddPost onClick={ this.handleAddPost }/>
        </section>
        );
    }
}

export default Blog;