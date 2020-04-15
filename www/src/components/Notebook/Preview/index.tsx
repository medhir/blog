import { useEffect, useState } from 'react'
import { read } from 'fs'

interface PreviewProps {
  mdx: string
}

const Preview = ({ mdx }: PreviewProps) => {
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
      }),
    })
      .then((response) => response.json())
      .then((data) => setMdxPreviewURL(data.url))
      .catch((err) => setError(err))
  }, [])
  return (
    <div>
      {mdxPreviewURL && <iframe src={mdxPreviewURL} />}
      {error && <h2>{JSON.stringify(error)}</h2>}
    </div>
  )
}

export default Preview
