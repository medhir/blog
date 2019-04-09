import React from 'react'
import PostsList from './PostsList'
import DraftsList from './DraftsList'
import AddPost from './AddPost'
import Auth from '../../../Auth'

const BlogList = (props) => {
    return (
        <section className="blog">
            <PostsList posts={ props.posts } />
            <Auth>
                <DraftsList drafts = { props.drafts } />
                <AddPost match={ props.match } />
            </Auth>
        </section>
    )
}

export default BlogList