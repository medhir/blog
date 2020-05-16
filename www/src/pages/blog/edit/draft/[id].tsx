import { GetServerSideProps } from 'next'
import http from '../../../../utility/http'
import Notebook from '../../../../components/notebook'
import { DraftMetadata } from '../../../../components/blog/types'

const DraftEditor = ({ mdx }) => {
  return <Notebook mdx={mdx} />
}

export default DraftEditor

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const response = await http.Get(`/blog/draft/${ctx.params.id}`, {
    headers: ctx.req ? { cookie: ctx.req.headers.cookie } : undefined,
  })
  const draft: DraftMetadata = response.data
  return {
    props: {
      mdx: draft.markdown,
    },
  }
}
