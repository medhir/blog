import React, { Component, Fragment } from 'react';
import { Route } from 'react-router-dom'
import BlogList from './modules/BlogList'
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
    handleUpdate = () => {
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
                    <Route exact path={ `${ this.props.match.path }/new/draft` } 
                           component={ () => <Editor handleUpdate={ this.handleUpdate.bind(this) } markdown={ md } { ...this.props }/> }/>
                    <Route path={ `${ this.props.match.path }/draft/:id` } 
                           component={ () => <Editor handleUpdate={ this.handleUpdate.bind(this) } draft={ this.props.location.state } { ...this.props }/> }/>
                </Fragment>
            )
        } else {
            return <Loading />
        }
    }
}

export default Blog;