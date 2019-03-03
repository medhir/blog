import React, { Component, Fragment } from 'react';
import { Link, Route } from 'react-router-dom'
import Editor from '../Editor';
import BlogPost from './BlogPost';
import './Blog.css';
import md from './popplers'

const BlogPosts = (props) => {
    const posts = props.posts.map(post => {
        return <BlogPost post={ post } />
    });

    return <ul className="posts">{ posts }</ul>
}

const AddPost = (props) => {
    return (
        <Link to={ `${ props.match.path }/add` }>
            <button className="addPost">Add A Post</button>
        </Link>
    )
}

const BlogView = (props) => {
    return (
        <section className="blog">
            <BlogPosts posts={ props.posts } />
            <AddPost match={ props.match } />
        </section>
    )
}

class Blog extends Component {
    constructor (props) {
        super(props);   
        this.state = {
            add: false,
            posts: [
                {
                    title: "Barp",
                    subtitle: "Barp.com",
                    date: new Date().toDateString()
                }, 
                {
                    title: "Darp",
                    date: new Date().toDateString()
                }
            ]
        }
    }

    render () {
        return (
            <Fragment>
                <Route 
                    exact 
                    path={ this.props.match.path } 
                    component={ () => <BlogView match={ this.props.match } posts={ this.state.posts } /> } />
                <Route path={ `${ this.props.match.path }/add` } component={ () => <Editor markdown={ md } /> }/>
            </Fragment>
        )
    }
}

export default Blog;