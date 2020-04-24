import { useEffect, useState } from 'react'
import styles from '../notebook.module.scss'

interface PreviewProps {
  mdx: string
  id: string
}

const Preview = ({ mdx, id }: PreviewProps) => {
  const [mdxPreviewURL, setMdxPreviewURL] = useState()
  const [error, setError] = useState()

  useEffect(() => {
    fetch('/api/mdx/draft', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mdx,
        id,
      }),
    })
      .then((response) => response.json())
      .then((data) => setMdxPreviewURL(data.url))
      .catch((err) => setError(err))
  }, [mdx])

  return (
    <div className={styles.preview}>
      {mdxPreviewURL && <iframe src={mdxPreviewURL} />}
      {error && <p>{JSON.stringify(error)}</p>}
    </div>
  )
}

export default Preview
