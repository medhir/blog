import React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'

import Layout from '../../components/layout'
import Post from '../../components/blog/modules/Post'
import { PostMetadata } from '../../components/blog/types'
import http from '../../utility/http'

interface BlogProps {
  post: PostMetadata
}

const Blog = ({ post }: BlogProps) => (
  <Layout>
    <Post markdown={post.markdown} />
  </Layout>
)

export default Blog

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await http.Get('https://medhir.com/api/blog/posts')
  const data = await response.json()
  const posts: Array<PostMetadata> = data.posts
  const paths = posts.map((post) => ({
    params: { slug: post.titlePath },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const response = await http.Get(
    `http://medhir.com/api/blog/post/${params.slug}`
  )
  const post: PostMetadata = await response.json()

  return {
    props: {
      post,
    },
  }
}
