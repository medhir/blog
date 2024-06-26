import React from "react";
import { GetServerSideProps } from "next";
import { serialize } from "next-mdx-remote/serialize";

import Post from "@/components/blog/modules/Post";
import http from "@/utility/http";
import Head from "@/components/head";
import { PostMetadata } from "@/components/blog";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

interface BlogProps {
  post: PostMetadata;
  source: MDXRemoteSerializeResult;
}

const Blog = ({ post, source }: BlogProps) => (
  <>
    <Head
      title={post.title}
      description={source.frontmatter.description as string}
      keywords={source.frontmatter.keywords as string}
    />
    <Post postMetadata={post} source={source} />
  </>
);

export default Blog;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const response = await http.Get(`/blog/post/${params?.slug}`);
  /** @type {import('rehype-pretty-code').Options} */
  const rehypeOptions = {
    keepBackground: false,
    theme: "one-light",
  };
  const post: PostMetadata = response.data;
  const serialized = await serialize(post.markdown, {
    mdxOptions: {
      remarkPlugins: [],
      // @ts-ignore
      rehypePlugins: [[rehypePrettyCode, rehypeOptions], rehypeSlug],
    },
    parseFrontmatter: true,
  });

  return {
    props: {
      post: post,
      source: serialized,
    },
  };
};
