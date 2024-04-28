import React from "react";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";

// import renderToString from 'next-mdx-remote/render-to-string'
// import { Components } from '../../components/mdx-viewer'
import Post from "../../components/blog/modules/Post";
import http from "../../utility/http";
import Head from "../../components/head";
import { PostMetadata } from "../../components/blog";

interface BlogProps {
  post: PostMetadata;
  source: any;
}

const Blog = ({ post, source }: BlogProps) => (
  <>
    <Head title={post.title} />
    <Post source={source} />
  </>
);

export default Blog;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const response = await http.Get(`/blog/post/${params?.slug}`);

  const post: PostMetadata = response.data;
  const renderedString = "await renderToString(post.markdown, Components)";

  return {
    props: {
      post: post,
      source: renderedString,
    },
  };
};
