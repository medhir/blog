import React from "react";
import styles from "./article.module.scss";
import {MDXRemote, MDXRemoteSerializeResult} from "next-mdx-remote";

import {useMDXComponents} from "@/mdx_components";

interface PostProps {
  source: MDXRemoteSerializeResult;
}


const Post = ({ source }: PostProps) => {
    const components = useMDXComponents()
    return <section>
        <article className={styles.article}>
            <MDXRemote {...source} components={components} lazy/>
        </article>
    </section>
}

export default Post;
