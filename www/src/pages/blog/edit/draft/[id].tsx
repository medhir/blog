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
  draftData,
}: {
  auth: boolean;
  id: string;
  mdx: string;
  draftData: PostMetadata;
}) => (
  <BlogEditor
    auth={auth}
    id={id}
    draft={true}
    mdx={mdx}
    draftData={draftData}
  />
);

export default DraftEditor;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const authResponse = await Authenticated(ctx, Roles.BlogOwner);

  if (authResponse.auth) {
    const draftResponse = await http.Get(`/blog/draft/${ctx.params?.id}`, {
      headers: { cookie: authResponse.cookies },
    });
    return {
      props: {
        auth: authResponse.auth,
        id: ctx.params?.id,
        draftData: draftResponse.data,
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
