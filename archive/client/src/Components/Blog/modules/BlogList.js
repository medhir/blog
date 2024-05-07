import React from 'react'
import PropTypes from 'prop-types'
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

BlogList.propTypes = {
  drafts: PropTypes.array,
  posts: PropTypes.array,
  match: PropTypes.object,
}

export default BlogList
