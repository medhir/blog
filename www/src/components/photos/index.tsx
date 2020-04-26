import { useState, useEffect } from 'react'
import Head from '../head'
import styles from './photos.module.scss'
import Layout from '../layout'

interface PhotosProps {
  photos: string[]
}

const Photos = ({ photos }: PhotosProps) => {
  const [displayPhotos, setDisplayPhotos] = useState(photos.slice(0, 5))

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.scrollHeight - 900 &&
      displayPhotos.length <= photos.length
    ) {
      const numDisplayPhotos = displayPhotos.length
      const additionalURLs = photos.slice(
        numDisplayPhotos,
        numDisplayPhotos + 1
      )
      const newDisplayPhotos = displayPhotos.concat(additionalURLs)
      setDisplayPhotos(newDisplayPhotos)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  })

  return (
    <Layout>
      <Head title="medhir.photos" />
      <section className={styles.photos}>
        {displayPhotos.map((photo) => (
          <div className={styles.photo} key={photo}>
            <img
              src={
                process.env.environment === 'production'
                  ? `https://s3-us-west-2.amazonaws.com/medhir-blog-dev/${photo}`
                  : photo
              }
            />
          </div>
        ))}
      </section>
    </Layout>
  )
}

export default Photos
