import Auth, { Roles } from '../../../../../components/auth'
import Lesson from '../../../../../components/learn/lesson'
import { GetServerSideProps } from 'next'

const NewLesson = ({ id, courseID }) => (
  <Auth role={Roles.BlogOwner} prompt>
    <Lesson id={id} courseID={courseID} />
  </Auth>
)

export default NewLesson

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      id: ctx.params.lesson_id,
      courseID: ctx.params.id,
    },
  }
}
