import Auth, { Roles } from '../../../components/auth'
import Blog from '../../../components/blog'
import { GetServerSideProps } from 'next'
import http from '../../../utility/http'

const Edit = ({ posts }) => {
  return (
    <Auth role={Roles.BlogOwner} prompt={true}>
      <Blog posts={posts} withDrafts />
    </Auth>
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
