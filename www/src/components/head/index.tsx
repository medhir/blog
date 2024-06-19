import NextHead from "next/head";

interface HeadProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
}

const Head = ({ title, description, keywords, image }: HeadProps) => (
  <NextHead>
    <title>{title}</title>
    <meta name="og:title" content={title} />
    {description && <meta name="description" content={description} />}
    {description && <meta name="og:description" content={description} />}
    {keywords && <meta name="keywords" content={keywords} />}
    {keywords && <meta name="og:keywords" content={keywords} />}
    {image && <meta name="og:image" content={image} />}
    <meta name="author" content="Medhir Bhargava" />
    <link rel="icon" href="/favicon.ico" />
  </NextHead>
);

export default Head;
