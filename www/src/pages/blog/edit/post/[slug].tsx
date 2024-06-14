import { GetServerSideProps } from "next";
import React from "react";
import { Roles } from "@/components/auth";
import BlogEditor from "@/components/blog-editor";
import { Authenticated } from "@/utility/auth";
import http from "@/utility/http";
import { PostMetadata } from "@/components/blog";

const DraftEditor = ({
  auth,
  id,
  postMetadata,
  mdx,
}: {
  auth: any;
  id: any;
  postMetadata: PostMetadata;
  mdx: any;
}) => (
  <BlogEditor
    auth={auth}
    id={id}
    draft={false}
    postMetadata={postMetadata}
    mdx={mdx}
  />
);

export default DraftEditor;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const authResponse = await Authenticated(ctx, Roles.BlogOwner);

  if (authResponse.auth) {
    const postResponse = await http.Get(`/blog/post/${ctx.params?.slug}`, {
      headers: { cookie: authResponse.cookies },
    });
    return {
      props: {
        auth: authResponse.auth,
        id: postResponse.data.id,
        postMetadata: postResponse.data,
        mdx: postResponse.data.markdown,
      },
    };
  } else {
    return {
      props: {
        auth: false,
      },
    };
  }
};
