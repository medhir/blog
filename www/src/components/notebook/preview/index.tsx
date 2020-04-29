import MDXViewer from '../../mdx-viewer'
import styles from '../notebook.module.scss'
import articleStyles from '../../blog/modules/Post/article.module.scss'

interface PreviewProps {
  source: string
}

const Preview = ({ source }: PreviewProps) => {
  return (
    <div className={styles.preview}>
      <article className={`${styles.article} ${articleStyles.article}`}>
        {source && <MDXViewer source={source} />}
      </article>
    </div>
  )
}

export default Preview
