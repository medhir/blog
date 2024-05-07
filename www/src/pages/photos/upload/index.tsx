import React from "react";
import Uploader from "../../../components/uploader";
import { GetServerSideProps } from "next";
import { Authenticated } from "../../../utility/auth";
import { Roles } from "../../../components/auth";
import Login from "../../../components/auth/login";

const Upload = ({ auth }: { auth: any }) => {
  if (auth) {
    return <Uploader />;
  } else {
    return <Login role={Roles.BlogOwner} />;
  }
};

export default Upload;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const response = await Authenticated(ctx, Roles.BlogOwner);
  return {
    props: { auth: response.auth },
  };
};
