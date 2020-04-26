import React from 'react'
import http from '../../utility/http'
import PhotosComponent from '../../components/photos'

interface PhotosProps {
  photos: string[]
}

const Photos = ({ photos }: PhotosProps) => <PhotosComponent photos={photos} />

export default Photos

export async function getServerSideProps() {
  let response
  if (process.env.environment === 'production') {
    response = await http.Get('https://medhir.com/api/photos?album=main')
  } else {
    response = await http.Get('http://localhost:9000/photos')
  }
  const photos = await response.json()

  return {
    props: {
      photos,
    },
  }
}
