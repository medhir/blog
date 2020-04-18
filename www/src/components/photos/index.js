import React, { useEffect, useState } from 'react'
import './photos.css'

const Photos = ({ photos }) => {
  const [displayPhotos, setDisplayPhotos] = useState(photos.slice(0, 5))

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.scrollHeight - 900 &&
      displayPhotos.length <= photos.length
    ) {
      debugger
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
    <section className="photos">
      {displayPhotos.map((photo) => (
        <div className="photo">
          <img
            src={`https://s3-us-west-2.amazonaws.com/medhir-blog-dev/${photo}`}
          />
        </div>
      ))}
    </section>
  )
}

export default Photos
