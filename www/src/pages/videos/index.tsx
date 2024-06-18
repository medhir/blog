import React, { Component } from "react";
import { GetServerSideProps } from "next";
import { Authenticated } from "@/utility/auth";
import { Roles } from "@/components/auth";
import Login from "@/components/auth/login";
import MuxUploader from "@mux/mux-uploader-react";
import http, { Protected } from "@/utility/http";
import { CircularProgress } from "@material-ui/core";

interface VideoUploaderState {
  endpoint: string | null;
}

class VideoUploader extends Component<{}, VideoUploaderState> {
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      endpoint: null,
    };
  }

  componentDidMount() {
    Protected.Client.Post("/video", {})
      .then((success) => {
        this.setState({
          endpoint: success.data.url,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const { endpoint } = this.state;
    return endpoint ? (
      <MuxUploader endpoint={endpoint} />
    ) : (
      <CircularProgress />
    );
  }
}

const Upload = ({ auth }: { auth: any }) => {
  if (auth) {
    return <VideoUploader />;
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
