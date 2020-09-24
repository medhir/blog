import React from 'react'
import http from '../../utility/http'
import PhotosComponent, { PhotosProps } from '../../components/photos'
import { Authenticated } from '../../utility/auth'
import { Roles } from '../../components/auth'

const Photos = ({ auth, photos }: PhotosProps) => (
  <PhotosComponent auth={auth} photos={photos} />
)

export default Photos

export async function getServerSideProps(ctx) {
  const authResponse = await Authenticated(ctx, Roles.BlogOwner)
  const photoResponse = await http.Get('/photos')
  return {
    props: {
      auth: authResponse.auth,
      photos: photoResponse.data,
    },
  }
}
