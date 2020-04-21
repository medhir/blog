import { useState, useEffect } from 'react'
import Head from '../../components/head'
import http from '../../utility/http'
import styles from './photos.module.scss'

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
    <>
      <Head title="medhir.photos" />
      <section className={styles.photos}>
        {displayPhotos.map((photo) => (
          <div className={styles.photo}>
            <img
              src={`https://s3-us-west-2.amazonaws.com/medhir-blog-dev/${photo}`}
            />
          </div>
        ))}
      </section>
    </>
  )
}

export default Photos

export async function getServerSideProps() {
  const response = await http.Get('https://medhir.com/api/photos?album=main')
  const photos = await response.json()

  return {
    props: {
      photos,
    },
  }
}
