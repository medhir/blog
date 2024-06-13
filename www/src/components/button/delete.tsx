import React, { Component, ReactNode } from "react";
import { RedButton, GreenButton } from "./index";
import styles from "./button.module.scss";
import http from "../../utility/http";
import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import Paper from "@material-ui/core/Paper";

interface ApiButtonProps {
  children: ReactNode;
  className?: string;
  endpoint: string;
  callback: () => void;
  successMessage: string;
  occuringMessage: string;
  errorMessage: string;
}

interface ApiButtonState {
  initial: boolean;
  confirm: boolean;
  occuring: boolean;
  success: boolean;
  error: boolean;
}

/*
    DeleteButton is a component for targeted API-based delete actions.
    'endpoint' prop specifies an api endpoint
    'callback' prop specifies a callback function that is called once the request is successful
 */
class DeleteButton extends Component<ApiButtonProps, ApiButtonState> {
  constructor(props: ApiButtonProps) {
    super(props);
    this.state = {
      initial: true,
      confirm: false,
      occuring: false,
      success: false,
      error: false,
    };
  }

  setToConfirm() {
    this.setState({
      initial: false,
      confirm: true,
    });
  }

  revert() {
    this.setState({
      initial: true,
      confirm: false,
    });
  }

  setResource() {
    const { endpoint, callback } = this.props;
    this.setState(
      {
        confirm: false,
        occuring: true,
      },
      () => {
        http.Delete(endpoint).then(
          (success) => {
            if (success.status !== 200) {
              this.setState({
                occuring: false,
                error: true,
              });
            } else {
              this.setState(
                {
                  occuring: false,
                  success: true,
                },
                () => {
                  if (callback) {
                    callback();
                  }
                }
              );
            }
          },
          (error) => {
            this.setState({
              occuring: false,
              error: error,
            });
          }
        );
      }
    );
  }

  renderButton() {
    const { initial, confirm, occuring, success, error } = this.state;
    const { successMessage, occuringMessage, errorMessage } = this.props;
    if (initial) {
      return (
        <IconButton
          size="medium"
          className="delete"
          onClick={this.setToConfirm.bind(this)}
        >
          <DeleteIcon />
        </IconButton>
      );
    } else if (confirm) {
      return (
        <Paper className={styles.confirm}>
          <p>Are you sure?</p>
          <RedButton onClick={this.setResource.bind(this)}>Yes</RedButton>
          <GreenButton onClick={this.revert.bind(this)}>No</GreenButton>
        </Paper>
      );
    } else if (occuring) {
      return <RedButton>{occuringMessage}</RedButton>;
    } else if (success) {
      return <RedButton>{successMessage}</RedButton>;
    } else if (error) {
      return <RedButton>{errorMessage}</RedButton>;
    }
  }

  render() {
    const { className } = this.props;
    return <div className={className}>{this.renderButton()}</div>;
  }
}

export default DeleteButton;
