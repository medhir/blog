import Auth from '../../../components/auth'
import Notebook from '../../../components/notebook'
import Layout from '../../../components/layout'

const Edit = () => (
  <Layout>
    <Auth prompt={true}>
      <Notebook />
    </Auth>
  </Layout>
)

export default Edit
