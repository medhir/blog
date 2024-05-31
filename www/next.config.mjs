/** @type {import('next').NextConfig} */
import nextMDX from '@next/mdx'
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";

 
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagedelivery.net",
        port: "",
        pathname: "/aqtNOU--A2nlEvmj2b63lw/**"
      }
    ]
  }
}

/** @type {import('rehype-pretty-code').Options} */
const rehypeOptions = {
  keepBackground: false,
}
 
const withMDX = nextMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypePrettyCode, rehypeOptions], rehypeSlug],
  }
})
 
export default withMDX(nextConfig)