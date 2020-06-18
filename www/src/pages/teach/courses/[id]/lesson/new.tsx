import Auth, { Roles } from '../../../../../components/auth'
import Lesson from '../../../../../components/learn/lesson'
import { GetServerSideProps } from 'next'

const NewLesson = ({ courseID }) => (
  <Auth role={Roles.BlogOwner} prompt>
    <Lesson courseID={courseID} />
  </Auth>
)

export default NewLesson

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      courseID: ctx.params.id,
    },
  }
}
