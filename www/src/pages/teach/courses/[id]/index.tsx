import { GetServerSideProps } from 'next'
import { Roles } from '../../../../components/auth'
import Course from '../../../../components/learn/course'
import { Authenticated } from '../../../../utility/auth'
import Login from '../../../../components/auth/login'

const CourseByID = ({ auth, id }) => {
  if (auth) {
    return <Course id={id} />
  } else {
    return <Login role={Roles.BlogOwner} />
  }
}

export default CourseByID

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const auth = await Authenticated(ctx, Roles.BlogOwner)
  return {
    props: {
      auth,
      id: ctx.params.id,
    },
  }
}
