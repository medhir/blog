import { Roles } from '../../../../../components/auth'
import Lesson from '../../../../../components/learn/lesson'
import { GetServerSideProps } from 'next'
import { Authenticated } from '../../../../../utility/auth'
import Login from '../../../../../components/auth/login'
import http from '../../../../../utility/http'

const LessonByID = ({ auth, lesson, courseID }) => {
  if (auth) {
    return <Lesson lesson={lesson} courseID={courseID} />
  } else {
    return <Login role={Roles.BlogOwner} />
  }
}

export default LessonByID

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const authResponse = await Authenticated(ctx, Roles.BlogOwner)
  if (authResponse.auth) {
    const lessonResponse = await http.Get(`/lesson/${ctx.params.lesson_id}`, {
      headers: {
        cookie: authResponse.cookies,
      },
    })
    return {
      props: {
        auth: true,
        lesson: lessonResponse.data,
        courseID: ctx.params.id,
      },
    }
  }
  return {
    props: {
      auth: authResponse.auth,
      id: ctx.params.lesson_id,
      courseID: ctx.params.id,
    },
  }
}
