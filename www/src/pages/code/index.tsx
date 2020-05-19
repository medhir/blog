import Auth, { Roles } from '../../components/auth'
import Coder from '../../components/coder'

const Code = () => (
  <Auth role={Roles.BlogOwner} prompt>
    <Coder />
  </Auth>
)

export default Code
