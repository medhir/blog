import { Fragment } from 'react'
import Head from '../components/Head'
import http from '../utility/http'
import styles from './photos.module.scss'

interface PhotosProps {
  filePaths: string[]
}
const Photos = ({ filePaths }: PhotosProps) => {
  const croppedPaths = filePaths.slice(0, 5)
  return (
    <Fragment>
      <Head title="medhir.photos" />
      <section>
        {croppedPaths &&
          croppedPaths.map((filePath) => (
            <img
              className={styles.photo}
              src={`https://s3-us-west-2.amazonaws.com/medhir-blog-dev/${filePath}`}
            />
          ))}
      </section>
    </Fragment>
  )
}

export default Photos

export async function getServerSideProps() {
  const response = await http.Get('https://medhir.com/api/photos?album=main')
  const filePaths = await response.json()

  return {
    props: {
      filePaths,
    },
  }
}
