import { GetServerSideProps } from 'next'
import http from '../../../../utility/http'
import Notebook from '../../../../components/notebook'
import { DraftMetadata } from '../../../../components/blog/types'

import styles from './draft.module.scss'

const DraftEditor = ({ mdx }) => {
  return (
    <div className={styles.draft}>
      <Notebook
        scroll={false}
        mdx={mdx}
        onSave={() => {}}
        handleTextareaChange={() => {}}
      />
    </div>
  )
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
