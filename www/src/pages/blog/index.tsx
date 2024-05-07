import React from "react";
import { GetServerSideProps, GetStaticProps } from "next";

import BlogComponent from "../../components/blog";
import http from "../../utility/http";
import Head from "../../components/head";

const Blog = ({ posts }: { posts: any[] }) => (
  <>
    <Head title="medhir.blog" />
    <BlogComponent posts={posts} />
  </>
);

export default Blog;

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await http.Get("/blog/posts");

  return {
    props: {
      posts: response.data,
    },
  };
};
