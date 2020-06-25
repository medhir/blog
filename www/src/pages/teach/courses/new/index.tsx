import Course from "../../../../components/learn/course"
import Auth, { Roles } from "../../../../components/auth"

const NewCourse = () => (
  <Auth prompt role={Roles.BlogOwner}>
    <Course />
  </Auth>
)

export default NewCourse