import React from "react";
import Router from "next/router";
import PostsList from "./modules/PostsList";
import styles from "./blog.module.scss";
import DraftsList from "./modules/DraftsList";
import { Button } from "@material-ui/core";
import { Protected } from "../../utility/http";

interface BlogProps {
  drafts?: Array<PostMetadata>;
  edit?: boolean;
  posts: Array<PostMetadata>;
}

export interface PostMetadata {
  id: string;
  title: string;
  slug: string;
  markdown: string;
  created_on: string;
  saved_on?: string;
  published_on?: string;
  revised_on: string;
}

const Blog = ({ drafts, edit, posts }: BlogProps) => {
  const AddDraft = () => {
    const title = `Untitled ${Math.random()}`;
    Protected.Client.Post("/blog/draft/", {
      title,
      markdown: `---
title: ${title}
description: insert description here
keywords: keyword1, keyword2
---`,
    }).then((response) => {
      Router.push(`/blog/edit/draft/${response.data.id}`);
    });
  };
  return (
    <section className={styles.blog}>
      <PostsList posts={posts} edit={edit} />
      {drafts && <DraftsList drafts={drafts} />}
      {edit && (
        <Button
          className={styles.draftButton}
          variant="contained"
          color="primary"
          size="medium"
          onClick={AddDraft}
        >
          Add New Draft
        </Button>
      )}
    </section>
  );
};

export default Blog;
