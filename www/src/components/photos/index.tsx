import { useState, useEffect } from "react";
import Head from "../head";
import styles from "./photos.module.scss";
import DeleteButton from "../button/delete";
import Image, { ImageLoaderProps } from "next/image";

export interface PhotoData {
  blurDataURL: string;
  height: number;
  name: string;
  url: string;
  width: number;
}

export interface PhotosProps {
  auth?: boolean;
  photos: PhotoData[];
}

const Photos = ({ auth, photos }: PhotosProps) => {
  const cloudflareLoader = ({ src, width, quality }: ImageLoaderProps) => {
    return `${src.split("/public")[0]}/w=${width},q=${quality}`;
  };

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
              loader={cloudflareLoader}
              style={{
                width: "100%",
                height: "auto",
              }}
              quality={60}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
              priority={i < 4}
              placeholder={"blur"}
              blurDataURL={photo.blurDataURL}
            />
            {auth && (
              <DeleteButton
                endpoint={`/photos/${photo.name}`}
                className={styles.delete}
                successMessage="photo deleted"
                occuringMessage="deleting..."
                errorMessage="unable to delete photo"
                callback={() => {}}
              >
                Delete
              </DeleteButton>
            )}
          </div>
        ))}
      </section>
    </>
  );
};

export default Photos;
