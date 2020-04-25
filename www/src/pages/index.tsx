import Head from '../components/head'
import { Fragment } from 'react'
import { NextApiResponse } from 'next'

const Home = () => (
  <Fragment>
    <Head title="medhir.com" />
  </Fragment>
)

interface getInitialPropsContext {
  res: NextApiResponse
}

Home.getInitialProps = async ({ res }: getInitialPropsContext) => {
  if (res) {
    res.writeHead(301, {
      Location: '/photos',
    })
    res.end()
  }

  return {}
}

export default Home
