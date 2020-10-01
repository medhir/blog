import Course from '../../../../components/learn/course'
import { Roles } from '../../../../components/auth'
import { Authenticated } from '../../../../utility/auth'
import { GetServerSideProps } from 'next'
import Login from '../../../../components/auth/login'

const NewCourse = ({ auth }) => {
  if (auth) {
    return <Course />
  } else {
    return <Login role={Roles.BlogOwner} />
  }
}

export default NewCourse

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const response = await Authenticated(ctx, Roles.BlogOwner)

  return {
    props: { auth: response.auth },
  }
}
