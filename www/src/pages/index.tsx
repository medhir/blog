import Head from "../components/head";
import Image, { ImageLoaderProps } from "next/image";
import styles from "@/components/photos/photos.module.scss";
import http from "@/utility/http";
import MuxPlayer from "@mux/mux-player-react";

const photoMedia = "photo";
const videoMedia = "video";

interface MediaData {
  name: string;
  type: string;
  url: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
  muxPlaybackID?: string;
}

interface HomeProps {
  media: MediaData[];
}

const Home = ({ media }: HomeProps) => {
  const cloudflareLoader = ({ src, width, quality }: ImageLoaderProps) => {
    return `${src.split("/public")[0]}/w=${width},q=${quality}`;
  };

  return (
    <>
      <Head title="medhir.com" />
      <section className={styles.photos}>
        {media.map((mediaData, i) => {
          if (mediaData.type === photoMedia) {
            return (
              <div className={styles.photo} key={mediaData.name}>
                <Image
                  src={mediaData.url}
                  alt=""
                  width={mediaData.width}
                  height={mediaData.height}
                  loader={cloudflareLoader}
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                  quality={60}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
                  priority={i < 4}
                  placeholder={"blur"}
                  blurDataURL={mediaData.blurDataURL}
                />
              </div>
            );
          } else if (mediaData.type === videoMedia) {
            return (
              <div className={styles.photo} key={mediaData.name}>
                <MuxPlayer
                  playbackId={mediaData.muxPlaybackID}
                  autoPlay="any"
                  loop={true}
                  muted={true}
                  metadata={{
                    video_id: mediaData.name,
                    video_title: `Video ${mediaData.name}`,
                  }}
                />
              </div>
            );
          }
        })}
      </section>
    </>
  );
};

export async function getServerSideProps() {
  const media = await http.Get("/media");
  return {
    props: {
      media: media.data,
    },
  };
}

export default Home;
