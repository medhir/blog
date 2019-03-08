import React, { Component, Fragment } from 'react';
import { Link, Route } from 'react-router-dom'
import Editor from '../Editor';
import api from './api'
import './Blog.css';
import md from './popplers'
import Loading from '../../Layout/Loading';

const BlogPost = (props) => {
    const published = new Date(props.post.published).toString()
    return (
        <li className="post">
            <h3>{ props.post.title }</h3>
            <p>{ published }</p>
        </li>
    )
};

const BlogPosts = (props) => {
    if (props.posts === null) return null
    const posts = props.posts.map(post => {
        return <BlogPost post={ post } key={ post.id } />
    });

    return <ul className="posts">{ posts }</ul>
}

const BlogDraft = (props) => {
    const saved = new Date(props.draft.saved).toString()
    return (
        <li className="draft">
            <h3>{ props.draft.title }</h3>
            <p>{ `Last saved at: ${ saved }` }</p>
            <Link to={ { 
                pathname: `blog/drafts/edit/${ props.draft.id }`, 
                state: props.draft
            } }>View in Editor</Link>
        </li>
    )
}

const BlogDrafts = (props) => {
    if (props.drafts === null) return null
    const drafts = props.drafts.map(draft => {
        return <BlogDraft draft={ draft } key={ draft.id }/>
    })
    return <ul className="drafts">{ drafts }</ul>
}

const AddPost = (props) => {
    return (
        <Link to={ `${ props.match.path }/drafts/new` }>
            <button className="addPost">New Post</button>
        </Link>
    )
}

const BlogView = (props) => {
    return (
        <section className="blog">
            <BlogPosts posts={ props.posts } />
            <BlogDrafts drafts = { props.drafts } />
            <AddPost match={ props.match } />
        </section>
    )
}

class Blog extends Component {
    constructor (props) {
        super(props)   
        this.state = {
            add: false,
            posts: null, 
            drafts: null
        }
    }

    componentDidMount = () => {
        api.getPosts().then(success => {
            const data = success.data
            this.setState({
                posts: data.posts, 
                drafts: data.drafts
            })
        })
    }

    // Re-call API on Blog Draft Save
    handleSave = () => {
        api.getPosts().then(success => {
            const data = success.data
            this.setState({
                posts: data.posts, 
                drafts: data.drafts
            })
        })
    }

    render () {
        if (this.state.posts && this.state.drafts) {
            return (
                <Fragment>
                    <Route 
                        exact path={ this.props.match.path } 
                        component={ () => <BlogView match={ this.props.match } posts={ this.state.posts } drafts={ this.state.drafts }/> } />
                    <Route exact path={ `${ this.props.match.path }/drafts/new` } 
                           component={ () => <Editor handleSave={ this.handleSave.bind(this) } markdown={ md } /> }/>
                    <Route path={ `${ this.props.match.path }/drafts/edit/:id` } 
                           component={ () => <Editor handleSave={ this.handleSave.bind(this) } draft={ this.props.location.state }/> }/>       
                </Fragment>
            )
        } else {
            return <Loading />
        }
    }
}

export default Blog;