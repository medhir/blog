import React from "react";
import http from "../../utility/http";
import PhotosComponent, { PhotosProps } from "../../components/photos";

const Photos = ({ photos }: PhotosProps) => <PhotosComponent photos={photos} />;

export default Photos;

export async function getServerSideProps() {
  const photoResponse = await http.Get("/photos");
  return {
    props: {
      photos: photoResponse.data,
    },
  };
}
