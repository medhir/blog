import { useState, useEffect } from 'react'
import Head from '../head'
import styles from './photos.module.scss'
import DeleteButton from '../button/delete'
import Image, {ImageLoaderProps} from "next/image";

export interface PhotoData {
  name: string
  url: string
  width: number
  height: number
}

export interface PhotosProps {
  auth?: boolean
  photos: PhotoData[]
}

const Photos = ({ auth, photos }: PhotosProps) => {
  // const [displayPhotos, setDisplayPhotos] = useState(photos.slice(0, 5))
  //
  // const handleScroll = () => {
  //   if (
  //     window.innerHeight + window.scrollY >= document.body.scrollHeight - 900 &&
  //     displayPhotos.length <= photos.length
  //   ) {
  //     const numDisplayPhotos = displayPhotos.length
  //     const additionalURLs = photos.slice(
  //       numDisplayPhotos,
  //       numDisplayPhotos + 1
  //     )
  //     const newDisplayPhotos = displayPhotos.concat(additionalURLs)
  //     setDisplayPhotos(newDisplayPhotos)
  //   }
  // }

  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll)
  //
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll)
  //   }
  // })
  //   const normalizeSrc = (src: string) => {
  //       return src.startsWith('/') ? src.slice(1) : src;
  //   };

    // const cloudflareLoader = ({ src, width, quality }: ImageLoaderProps) => {
    //     const params = [`width=${width}`];
    //     if (quality) {
    //         params.push(`quality=${quality}`);
    //     }
    //     const paramsString = params.join(',');
    //     return `/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`;
    // };

        return (
    <>
      <Head title="medhir.photos" />
      <section className={styles.photos}>
        {photos.map((photo, i) => (
          <div className={styles.photo} key={photo.name}>
            <Image
                src={photo.url}
                alt=""
                width={photo.width}
                height={photo.height}
                // loader={cloudflareLoader}
                style={{
                  width: "100%",
                  height: "auto"
                }}
                // placeholder={"blur"}
            />
            {auth && (
              <DeleteButton
                endpoint={`/photos/${photo.name}`}
                className={styles.delete}
                successMessage="photo deleted"
                occuringMessage="deleting..."
                errorMessage="unable to delete photo"
                callback={() => {
                  // let newDisplayPhotos = displayPhotos.slice()
                  // newDisplayPhotos.splice(i, 1)
                  // setDisplayPhotos(newDisplayPhotos)
                }}
              >
                Delete
              </DeleteButton>
            )}
          </div>
        ))}
      </section>
    </>
  )
}

export default Photos
