import React from "react";
import styles from "./article.module.scss";
import {MDXRemote, MDXRemoteSerializeResult} from "next-mdx-remote";

interface PostProps {
  source: MDXRemoteSerializeResult;
}

const Post = ({ source }: PostProps) => (
  <section>
    <article className={styles.article}>
      <MDXRemote {...source} />
    </article>
  </section>
);

export default Post;
