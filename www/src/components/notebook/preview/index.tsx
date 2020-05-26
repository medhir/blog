import MDXViewer from '../../mdx-viewer'
import styles from '../notebook.module.scss'
import articleStyles from '../../blog/modules/Post/article.module.scss'

interface PreviewProps {
  source: string
  scroll: boolean
}

const Preview = ({ scroll, source }: PreviewProps) => {
  return (
    <div className={`${styles.preview} ${scroll ? styles.scroll : null}`}>
      <article className={`${styles.article} ${articleStyles.article}`}>
        {source && <MDXViewer source={source} />}
      </article>
    </div>
  )
}

export default Preview
