import React from "react";

import Link from "next/link";

import styles from "../blog.module.scss";
import { PostMetadata } from "..";

interface PostListItemProps {
  post: PostMetadata;
  edit?: boolean;
}

const PostListItem = ({ edit, post }: PostListItemProps) => {
  const locale = "en-US";
  const localeStringOptions: Intl.DateTimeFormatOptions = {
    month: "long", // long month format
    day: "numeric", // numeric day format
    year: "numeric", // numeric year format
  };
  const publishedDate = post.published_on
    ? new Date(post.published_on).toLocaleDateString(
        locale,
        localeStringOptions
      )
    : "";
  return (
    <li className={styles.post}>
      <Link
        href={edit ? `/blog/edit/post/${post.slug}` : `/blog/${post.slug}`}
        key={post.id}
      >
        <h3>{post.title}</h3>
        <p suppressHydrationWarning>{publishedDate}</p>
      </Link>
    </li>
  );
};

interface PostsListProps {
  edit?: boolean;
  posts: Array<PostMetadata>;
}

const PostsList = ({ edit, posts }: PostsListProps) => {
  if (posts === null) return null;
  const postListItems = posts.map((post) => {
    return <PostListItem edit={edit} post={post} key={post.id} />;
  });

  return <ul className={styles.posts}>{postListItems}</ul>;
};

export default PostsList;
