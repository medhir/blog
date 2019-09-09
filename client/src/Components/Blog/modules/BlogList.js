import React from 'react'
import PostsList from './PostsList'
import DraftsList from './DraftsList'
import AddPost from './AddPost'
import Auth from 'Auth'

const BlogList = props => {
  return (
    <Auth withLoginPrompt>
      <section className="blog">
        <PostsList posts={props.posts} />
        <DraftsList drafts={props.drafts} />
        <AddPost match={props.match} />
      </section>
    </Auth>
  )
}

export default BlogList
