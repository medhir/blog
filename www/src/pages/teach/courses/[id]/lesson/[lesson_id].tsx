import Auth, { Roles } from '../../../../../components/auth'
import Lesson from '../../../../../components/learn/lesson'
import { GetServerSideProps } from 'next'
import { Authenticated } from '../../../../../utility/auth'
import Login from '../../../../../components/auth/login'

const NewLesson = ({ auth, id, courseID }) => {
  if (auth) {
    return <Lesson id={id} courseID={courseID} />
  } else {
    return <Login role={Roles.BlogOwner} />
  }
}

export default NewLesson

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const auth = await Authenticated(ctx, Roles.BlogOwner)
  return {
    props: {
      auth,
      id: ctx.params.lesson_id,
      courseID: ctx.params.id,
    },
  }
}
