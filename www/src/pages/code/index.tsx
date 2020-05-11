import Layout from '../../components/layout'
import Auth from '../../components/auth'
import Coder from '../../components/coder'

const Code = () => (
  <Layout>
    <Auth prompt>
      <Coder />
    </Auth>
  </Layout>
)

export default Code
