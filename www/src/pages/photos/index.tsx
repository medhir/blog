import React from 'react'
import http from '../../utility/http'
import PhotosComponent from '../../components/photos'

interface PhotosProps {
  photos: string[]
}

const Photos = ({ photos }: PhotosProps) => <PhotosComponent photos={photos} />

export default Photos

export async function getServerSideProps() {
  const response = await http.Get('/photos')
  return {
    props: {
      photos: response.data,
    },
  }
}
