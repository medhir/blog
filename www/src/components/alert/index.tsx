import { Snackbar, SnackbarCloseReason } from "@material-ui/core";
import MuiAlert, { AlertProps as MuiAlertProps } from "@material-ui/lab/Alert";
import { SyntheticEvent, ReactNode } from "react";

type Severity = "success" | "info" | "warning" | "error";

function Alert(props: MuiAlertProps) {
  return <MuiAlert elevation={3} {...props} />;
}

interface AlertProps {
  action?: ReactNode;
  autoHideDuration?: number;
  children: ReactNode;
  onClose: (
    event: SyntheticEvent<Element, Event>,
    reason?: SnackbarCloseReason
  ) => void;
  open: boolean;
  severity?: Severity;
}

export interface AlertData {
  open: boolean;
  message: string;
}

export interface NotificationData {
  action?: ReactNode;
  open: boolean;
  message: string | ReactNode;
  severity?: Severity;
}

export const Notification = ({
  action,
  autoHideDuration,
  children,
  onClose,
  open,
  severity,
}: AlertProps) => (
  <Snackbar
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
    autoHideDuration={autoHideDuration || 6000}
    open={open}
    onClose={onClose}
  >
    <MuiAlert
      elevation={3}
      onClose={onClose}
      severity={severity || "info"}
      action={action}
    >
      {children}
    </MuiAlert>
  </Snackbar>
);

export const ErrorAlert = ({ children, onClose, open }: AlertProps) => (
  <Snackbar
    anchorOrigin={{ vertical: "top", horizontal: "right" }}
    open={open}
    autoHideDuration={6000}
    onClose={onClose}
  >
    <Alert onClose={onClose} severity="error">
      {children}
    </Alert>
  </Snackbar>
);

export const SuccessAlert = ({ children, onClose, open }: AlertProps) => (
  <Snackbar
    anchorOrigin={{ vertical: "top", horizontal: "right" }}
    open={open}
    autoHideDuration={6000}
    onClose={onClose}
  >
    <Alert onClose={onClose} severity="success">
      {children}
    </Alert>
  </Snackbar>
);
