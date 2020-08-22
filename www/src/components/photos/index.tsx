import { useState, useEffect } from 'react'
import Head from '../head'
import styles from './photos.module.scss'
import ApiButton, { HttpMethod } from '../button/api'

export interface PhotoData {
  name: string
  url: string
}

export interface PhotosProps {
  photos: PhotoData[]
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
        {displayPhotos.map((photo, i) => (
          <div className={styles.photo} key={photo.name}>
            <img src={photo.url} />
            <ApiButton
              endpoint={`/photos/${photo.name}`}
              httpMethod={HttpMethod.DELETE}
              className={styles.delete}
              successMessage="photo deleted"
              occuringMessage="deleting..."
              errorMessage="unable to delete photo"
              callback={() => {
                let newDisplayPhotos = displayPhotos.slice()
                newDisplayPhotos.splice(i, 1)
                setDisplayPhotos(newDisplayPhotos)
              }}
            >
              Delete
            </ApiButton>
          </div>
        ))}
      </section>
    </>
  )
}

export default Photos
