import Auth, { Roles } from "../../../components/auth";
import CoursesComponent from "../../../components/learn/courses";

const Courses = () => (
  <Auth prompt role={Roles.BlogOwner}>
    <CoursesComponent />
  </Auth>
)

export default Courses