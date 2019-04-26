import React, { Component, Fragment } from 'react';
import { Link, Route } from 'react-router-dom'
import BlogList from './modules/BlogList'
import Post from './modules/Post'
import Editor from '../Editor';
import api from './api'
import './Blog.css';
import md from './popplers'
import Loading from '../../Layout/Loading';

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
                        component={ () => <BlogList match={ this.props.match } posts={ this.state.posts } drafts={ this.state.drafts }/> } />
                    <Route exact path={ `${ this.props.match.path }/drafts/new` } 
                           component={ () => <Editor handleSave={ this.handleSave.bind(this) } markdown={ md } /> }/>
                    <Route path={ `${ this.props.match.path }/drafts/:id` } 
                           component={ () => <Editor handleSave={ this.handleSave.bind(this) } draft={ this.props.location.state }/> }/>
                    <Route path={ `${ this.props.match.path }/post/:titlePath` } 
                           component={ Post } />
                </Fragment>
            )
        } else {
            return <Loading />
        }
    }
}

export default Blog;