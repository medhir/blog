import React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'

import renderToString from 'next-mdx-remote/render-to-string'
import { Components } from '../../components/mdx-viewer'
import Layout from '../../components/layout'
import Post from '../../components/blog/modules/Post'
import { PostMetadata } from '../../components/blog/types'
import http from '../../utility/http'
import Head from '../../components/head'

interface BlogProps {
  post: PostMetadata
  source: any
}

const Blog = ({ post, source }: BlogProps) => (
  <Layout>
    <Head title={post.title} />
    <Post source={source} />
  </Layout>
)

export default Blog

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await http.Get('/blog/posts')
  const posts: Array<PostMetadata> = response.data
  const paths = posts.map((post) => ({
    params: { slug: post.titlePath },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const response = await http.Get(
    `/blog/post/${params.slug}`
  )

  const post: PostMetadata = response.data
  const renderedString = await renderToString(post.markdown, Components)

  return {
    props: {
      post: post,
      source: renderedString,
    },
  }
}
