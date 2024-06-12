import NextHead from "next/head";

interface HeadProps {
  title: string;
  description?: string;
  keywords?: string;
}

const Head = ({ title, description, keywords }: HeadProps) => (
  <NextHead>
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
    {keywords && <meta name="keywords" content={keywords} />}
    <meta name="author" content="Medhir Bhargava" />
    <link rel="icon" href="/favicon.ico" />
  </NextHead>
);

export default Head;
