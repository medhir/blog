import { Roles } from "../../../components/auth";
import Blog from "../../../components/blog";
import { GetServerSideProps } from "next";
import http from "../../../utility/http";
import Login from "../../../components/auth/login";
import { Authenticated } from "../../../utility/auth";

const Edit = ({
  auth,
  posts,
  drafts,
}: {
  auth: boolean;
  posts: any[];
  drafts: any[];
}) => {
  if (auth) {
    return <Blog edit={true} posts={posts} drafts={drafts} />;
  } else {
    return <Login role={Roles.BlogOwner} />;
  }
};

export default Edit;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const response = await Authenticated(ctx, Roles.BlogOwner);
  if (response.auth) {
    const postsResponse = await http.Get("/blog/posts");
    const draftsResponse = await http.Get("/blog/drafts", {
      headers: {
        cookie: response.cookies,
      },
    });
    return {
      props: {
        auth: true,
        posts: postsResponse.data,
        drafts: draftsResponse.data,
      },
    };
  } else {
    return {
      props: { auth: false },
    };
  }
};
