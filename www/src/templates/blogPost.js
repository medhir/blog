import React from 'react'

import Layout from '../components/layout'
import BlogPostComponent from '../components/blog/modules/Post'

const BlogPost = ({ pageContext: data }) => (
  <Layout>
    <BlogPostComponent markdown={data.markdown} />
  </Layout>
)

export default BlogPost
