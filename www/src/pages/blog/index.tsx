import React from 'react'
import { GetStaticProps } from 'next'

import BlogComponent from '../../components/blog'
import Layout from '../../components/layout'
import http from '../../utility/http'
import Head from '../../components/head'

const Blog = ({ posts }) => (
  <Layout>
    <Head title="medhir.blog" />
    <BlogComponent posts={posts} />
  </Layout>
)

export default Blog

export const getStaticProps: GetStaticProps = async () => {
  const response = await http.Get('/blog/posts')

  return {
    props: {
      posts: response.data,
    },
  }
}
