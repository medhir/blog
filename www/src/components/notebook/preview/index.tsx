import MDXViewer from '../../mdx-viewer'
import styles from '../notebook.module.scss'
import articleStyles from '../../blog/modules/Post/article.module.scss'

interface PreviewProps {
  articleRef?: React.RefObject<HTMLElement>
  source: string
  scroll: boolean
}

const Preview = ({ articleRef, scroll, source }: PreviewProps) => {
  return (
    <div className={`${styles.preview} ${scroll ? styles.scroll : null}`}>
      <article
        ref={articleRef}
        className={`${styles.article} ${articleStyles.article}`}
      >
        {source && <MDXViewer source={source} />}
      </article>
    </div>
  )
}

export default Preview
