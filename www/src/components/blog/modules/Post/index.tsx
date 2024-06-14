import React from "react";
import styles from "./article.module.scss";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

import { useMDXComponents } from "@/mdx_components";
import { PostMetadata } from "@/components/blog";
import articleStyles from "@/components/blog/modules/Post/article.module.scss";

interface PostProps {
  postMetadata: PostMetadata;
  source: MDXRemoteSerializeResult;
}

const Post = ({ postMetadata, source }: PostProps) => {
  const components = useMDXComponents();
  const locale = "en-US";
  const localeStringOptions: Intl.DateTimeFormatOptions = {
    month: "long", // long month format
    day: "numeric", // numeric day format
    year: "numeric", // numeric year format
  };
  const formattedDate = new Date(
    postMetadata.published_on as number
  ).toLocaleDateString(locale, localeStringOptions);
  return (
    <section style={{ padding: "0px 20px" }}>
      <article className={styles.article}>
        <h1>{source.frontmatter.title as string}</h1>
        <div className={styles.publishDate}>
          <p>
            <time dateTime={formattedDate}>{formattedDate}</time>
          </p>
        </div>
        <MDXRemote {...source} components={components} lazy />
      </article>
    </section>
  );
};

export default Post;
