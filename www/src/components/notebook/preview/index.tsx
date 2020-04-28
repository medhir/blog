import MDXViewer from '../../mdx-viewer'
import styles from '../notebook.module.scss'
import previewStyles from './preview.module.scss'
import articleStyles from '../../blog/modules/Post/article.module.scss'

interface PreviewProps {
  source: string
  error: any
}

const Preview = ({ source, error }: PreviewProps) => {
  return (
    <div className={styles.preview}>
      {source && !error && (
        <article className={articleStyles.article}>
          <MDXViewer source={source} />
        </article>
      )}
      {error && (
        <pre className={previewStyles.mdx_preview_error}>
          {JSON.stringify(error, undefined, 3)}
        </pre>
      )}
    </div>
  )
}

export default Preview
