import Head from '../components/head'
import { Fragment } from 'react'

const Home = () => (
  <Fragment>
    <Head title="medhir.com" />
  </Fragment>
)

Home.getInitialProps = async ({ res }) => {
  if (res) {
    res.writeHead(301, {
      Location: '/photos',
    })
    res.end()
  }

  return {}
}

export default Home
