import React from "react";
import styles from "./article.module.scss";
import {MDXRemote, MDXRemoteSerializeResult} from "next-mdx-remote";
import CurveTool from "@/components/CurveTool";

interface PostProps {
  source: MDXRemoteSerializeResult;
}

const components = {
    CurveTool
}

const Post = ({ source }: PostProps) => (
  <section>
    <article className={styles.article}>
      <MDXRemote {...source} components={components} lazy/>
    </article>
  </section>
);

export default Post;
