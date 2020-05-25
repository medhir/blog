import Auth, { Roles } from '../../components/auth'
import Lesson from '../../components/learn/lesson'

const Code = () => (
  <Auth role={Roles.BlogOwner} prompt>
    <Lesson />
  </Auth>
)

export default Code
