import React from 'react'

import Layout from '../components/layout'
import PhotosComponent from '../components/photos'

const Photos = ({ pageContext: data }) => {
  console.dir(data)
  return (
    <Layout>
      {/* For some reason, data goes from an array -> objects. */}
      <PhotosComponent photos={Object.values(data)} />
    </Layout>
  )
}

export default Photos
