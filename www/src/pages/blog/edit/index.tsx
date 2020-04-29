import Auth from '../../../components/auth'
import Layout from '../../../components/layout'
import Blog from '../../../components/blog'
import { GetServerSideProps } from 'next'
import http from '../../../utility/http'

const Edit = ({ posts }) => {
  return (
    <Layout>
      <Auth prompt={true}>
        <Blog posts={posts} withDrafts />
      </Auth>
    </Layout>
  )
}

export default Edit

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const postsResponse = await http.Get('/blog/posts')
  return {
    props: {
      posts: postsResponse.data,
    },
  }
}
