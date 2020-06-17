import { GetServerSideProps } from 'next'
import Auth, { Roles } from '../../../../components/auth'
import Course from '../../../../components/learn/course'

const CourseByID = ({ id }) => (
  <Auth prompt role={Roles.BlogOwner}>
    <Course id={id} />
  </Auth>
)

export default CourseByID

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      id: ctx.params.id,
    },
  }
}
