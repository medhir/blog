import Auth, { Roles } from '../../components/auth'
import Coder from '../../components/code'

const Code = () => (
  <Auth role={Roles.BlogOwner} prompt>
    <Coder />
  </Auth>
)

export default Code
