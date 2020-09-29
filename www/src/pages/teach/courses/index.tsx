import { Roles } from '../../../components/auth'
import CoursesComponent from '../../../components/learn/courses'
import { GetServerSideProps } from 'next'
import { Authenticated } from '../../../utility/auth'
import Login from '../../../components/auth/login'
import http from '../../../utility/http'

const Courses = ({ auth, courses }) => {
  if (auth) {
    return <CoursesComponent courses={courses} />
  } else {
    return <Login role={Roles.BlogOwner} />
  }
}

export default Courses

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const response = await Authenticated(ctx, Roles.BlogOwner)
  if (response.auth) {
    const coursesResponse = await http.Get('/courses/', {
      headers: {
        cookie: response.cookies,
      },
    })
    return {
      props: {
        auth: true,
        courses: coursesResponse.data,
      },
    }
  }
  return {
    props: { auth: response.auth },
  }
}
