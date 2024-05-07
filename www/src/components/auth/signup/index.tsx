import React, { useState } from "react";
import Router from "next/router";
import {
  TextField,
  Button,
  Container,
  FormControlLabel,
  Checkbox,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import styles from "./signup.module.scss";
import Head from "../../head";
import http from "../../../utility/http";
import { AxiosError } from "axios";
import { ErrorAlert, SuccessAlert } from "../../alert";

interface SubmitErrorAlert {
  open: boolean;
  message: string;
}

const SignUpForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsOfServiceChecked, setTermsOfServiceChecked] = useState(false);
  const [termsOfServiceDialogOpen, setTermsOfServiceDialogOpen] =
    useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [confirmPasswordHelperText, setConfirmPasswordHelperText] =
    useState("");
  const [submitSuccessAlert, setSubmitSuccessAlert] = useState(false);
  const [submitErrorAlert, setSubmitErrorAlert] = useState({
    open: false,
    message: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password != confirmPassword) {
      setConfirmPasswordError(true);
      setConfirmPasswordHelperText("the passwords entered do not match!");
      return;
    }
    if (!termsOfServiceChecked) {
      setSubmitErrorAlert({
        open: true,
        message: "you must agree to the Terms of Service to register.",
      });
      return;
    }
    http
      .Post("/register", {
        username: username,
        email: email,
        password: password,
      })
      .then(() => {
        setSubmitSuccessAlert(true);
        setTimeout(() => {
          Router.push("/courses");
        }, 2000);
      })
      .catch((error: AxiosError) => {
        setSubmitErrorAlert({
          open: true,
          message: error.response?.data as string,
        });
      });
  };

  const updateUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
  };

  const updateEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
  };

  const updatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  };

  const updateConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
  };

  const handleSubmitErrorAlertClose = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSubmitErrorAlert({
      open: false,
      message: "",
    });
  };

  const handleSubmitSuccessAlertClose = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSubmitSuccessAlert(false);
  };

  return (
    <>
      <Head title="sign up" />
      <section className={styles.signup}>
        <Container maxWidth="sm">
          <form onSubmit={handleSubmit}>
            <h2>start learning.</h2>
            <TextField
              required
              className={styles.textField}
              label="username"
              variant="outlined"
              size="small"
              value={username}
              onChange={updateUsername}
            />
            <TextField
              required
              className={styles.textField}
              label="email address"
              variant="outlined"
              size="small"
              type="email"
              value={email}
              onChange={updateEmail}
            />
            <TextField
              required
              className={styles.textField}
              label="password"
              variant="outlined"
              size="small"
              type="password"
              value={password}
              onChange={updatePassword}
            />
            <TextField
              required
              className={styles.textField}
              label="confirm password"
              variant="outlined"
              size="small"
              type="password"
              value={confirmPassword}
              onChange={updateConfirmPassword}
              helperText={confirmPasswordHelperText}
              error={confirmPasswordError}
            />
            <FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={termsOfServiceChecked}
                    onChange={() => {
                      setTermsOfServiceDialogOpen(true);
                    }}
                    name="termsOfService"
                  />
                }
                label={
                  <p>
                    I have agreed to the{" "}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setTermsOfServiceDialogOpen(true);
                      }}
                    >
                      Terms of Service
                    </a>
                  </p>
                }
              />
            </FormControl>
            <Button
              className={styles.button}
              variant="contained"
              color="primary"
              type="submit"
            >
              Sign Up
            </Button>
            <Dialog
              open={termsOfServiceDialogOpen}
              onClose={() => {
                setTermsOfServiceDialogOpen(false);
              }}
              scroll="paper"
              aria-labelledby="terms-of-service-dialog-title"
            >
              <DialogTitle id="terms-of-service-dialog-title">
                Terms of Service
              </DialogTitle>
              <DialogContent dividers={true}>
                <DialogContentText>
                  {[...new Array(50)]
                    .map(
                      () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`
                    )
                    .join("\n")}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  color="secondary"
                  onClick={() => {
                    setTermsOfServiceDialogOpen(false);
                    setTermsOfServiceChecked(false);
                  }}
                >
                  I Do Not Agree
                </Button>
                <Button
                  color="primary"
                  onClick={() => {
                    setTermsOfServiceDialogOpen(false);
                    setTermsOfServiceChecked(true);
                  }}
                >
                  I Agree
                </Button>
              </DialogActions>
            </Dialog>
            {submitSuccessAlert && (
              <SuccessAlert
                open={submitSuccessAlert}
                onClose={handleSubmitSuccessAlertClose}
              >
                Your account has been created. Please check your email to verify
                your account and log in.
              </SuccessAlert>
            )}
            {submitErrorAlert.open && (
              <ErrorAlert
                open={submitErrorAlert.open}
                onClose={handleSubmitErrorAlertClose}
              >
                {`there was an issue registering your account - ${submitErrorAlert.message}`}
              </ErrorAlert>
            )}
          </form>
        </Container>
      </section>
    </>
  );
};

export default SignUpForm;
