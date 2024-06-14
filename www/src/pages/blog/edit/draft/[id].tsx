import { GetServerSideProps } from "next";
import React from "react";
import { Roles } from "../../../../components/auth";
import BlogEditor from "../../../../components/blog-editor";
import { Authenticated } from "../../../../utility/auth";
import http from "../../../../utility/http";
import { PostMetadata } from "@/components/blog";

const DraftEditor = ({
  auth,
  id,
  mdx,
  postMetadata,
}: {
  auth: boolean;
  id: string;
  mdx: string;
  postMetadata: PostMetadata;
}) => (
  <BlogEditor
    auth={auth}
    id={id}
    draft={true}
    mdx={mdx}
    postMetadata={postMetadata}
  />
);

export default DraftEditor;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const authResponse = await Authenticated(ctx, Roles.BlogOwner);

  if (authResponse.auth) {
    const draftResponse = await http.Get(`/blog/draft/${ctx.params?.id}`, {
      headers: { cookie: authResponse.cookies },
    });
    console.log(draftResponse);
    return {
      props: {
        auth: authResponse.auth,
        id: ctx.params?.id,
        postMetadata: draftResponse.data,
        mdx: draftResponse.data.markdown,
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
