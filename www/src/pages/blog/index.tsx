import React from 'react'
import { GetServerSideProps } from 'next'

import BlogComponent from '../../components/blog'
import Layout from '../../components/layout'
import http from '../../utility/http'

const Blog = ({ posts }) => (
  <Layout>
    <BlogComponent posts={posts} />
  </Layout>
)

export default Blog

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await http.Get('https://medhir.com/api/blog/posts')
  const data = await response.json()
  return {
    props: {
      posts: data.posts,
    },
  }
}
