import NextHead from "next/head";
import React from "react";

interface HeadProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
}

const Head = ({ title, description, keywords, image }: HeadProps) => (
  <NextHead>
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
    {keywords && <meta name="keywords" content={keywords} />}

    <meta name="og:title" content={title} />
    {description && <meta name="og:description" content={description} />}
    {image && <meta name="og:image" content={image} />}

    <meta name="twitter:title" content={title} />
    {description && <meta name="twitter:description" content={description} />}
    {image && <meta name="twitter:image" content={image} />}
  </NextHead>
);

export default Head;
