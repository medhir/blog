import React, { Component } from "react";
import { GetServerSideProps } from "next";
import { Authenticated } from "@/utility/auth";
import { Roles } from "@/components/auth";
import Login from "@/components/auth/login";
import MuxUploader from "@mux/mux-uploader-react";
import http, { Protected } from "@/utility/http";
import { CircularProgress } from "@material-ui/core";
import { AlertData, ErrorAlert, SuccessAlert } from "@/components/alert";
import { AxiosError } from "axios";

interface VideoUploaderState {
  id: string | null;
  endpoint: string | null;
  successAlert: AlertData;
  errorAlert: AlertData;
}

class VideoUploader extends Component<{}, VideoUploaderState> {
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      id: null,
      endpoint: null,
      successAlert: {
        open: false,
        message: "",
      },
      errorAlert: {
        open: false,
        message: "",
      },
    };

    this.getVideoURL = this.getVideoURL.bind(this);
    this.postVideoObject = this.postVideoObject.bind(this);
    this.closeSuccessAlert = this.closeSuccessAlert.bind(this);
    this.closeErrorAlert = this.closeErrorAlert.bind(this);
  }

  componentDidMount() {
    this.getVideoURL();
  }

  getVideoURL() {
    Protected.Client.Get("/video")
      .then((success) => {
        console.dir(success);
        this.setState({
          id: success.data.id,
          endpoint: success.data.url,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  postVideoObject() {
    const { getVideoURL } = this;
    const { id, endpoint } = this.state;
    Protected.Client.Post("/video", {
      id: id,
      url: endpoint,
    })
      .then((success) => {
        console.dir(success);
        this.setState(
          {
            successAlert: {
              open: true,
              message: `video successfully saved`,
            },
            id: null,
            endpoint: null,
          },
          getVideoURL
        );
      })
      .catch((error: AxiosError) => {
        this.setState({
          errorAlert: {
            open: true,
            message: `unable to save video: ${error.response!!.data as string}`,
          },
        });
      });
  }

  closeSuccessAlert() {
    this.setState({
      successAlert: {
        open: false,
        message: "",
      },
    });
  }

  closeErrorAlert() {
    this.setState({
      errorAlert: {
        open: false,
        message: "",
      },
    });
  }

  render() {
    const { postVideoObject, closeSuccessAlert, closeErrorAlert } = this;
    const { endpoint, errorAlert, successAlert } = this.state;
    return (
      <>
        {endpoint ? (
          <MuxUploader endpoint={endpoint} onSuccess={postVideoObject} />
        ) : (
          <CircularProgress />
        )}
        {errorAlert.open && (
          <ErrorAlert open={errorAlert.open} onClose={closeErrorAlert}>
            {errorAlert.message}
          </ErrorAlert>
        )}
        {successAlert.open && (
          <SuccessAlert open={successAlert.open} onClose={closeSuccessAlert}>
            {successAlert.message}
          </SuccessAlert>
        )}
      </>
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
