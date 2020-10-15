import { GetServerSideProps } from 'next'
import { Roles } from '../../../../components/auth'
import Course from '../../../../components/learn/course'
import { Authenticated } from '../../../../utility/auth'
import Login from '../../../../components/auth/login'
import http from '../../../../utility/http'

const CourseByID = ({ auth, course }) => {
  if (auth) {
    return <Course course={course} />
  } else {
    return <Login role={Roles.BlogOwner} />
  }
}

export default CourseByID

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const response = await Authenticated(ctx, Roles.BlogOwner)
  if (response.auth) {
    const courseResponse = await http.Get(`/course/${ctx.params.id}`, {
      headers: {
        cookie: response.cookies,
      },
    })
    return {
      props: {
        auth: true,
        course: courseResponse.data,
      },
    }
  }
  return {
    props: {
      auth: false,
    },
  }
}
