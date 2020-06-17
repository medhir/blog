import Auth, { Roles } from '../../../../../components/auth'
import Lesson from '../../../../../components/learn/lesson'

const NewLesson = () => (
  <Auth role={Roles.BlogOwner} prompt>
    <Lesson />
  </Auth>
)

export default NewLesson
