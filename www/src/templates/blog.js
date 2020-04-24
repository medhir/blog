import React from 'react'

import Layout from '../components/layout'
import BlogComponent from '../components/blog'

const Blog = ({ pageContext: { posts } }) => {
  return (
    <Layout>
      <BlogComponent posts={posts} />
    </Layout>
  )
}

export default Blog
