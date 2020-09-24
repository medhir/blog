import { Snackbar, SnackbarCloseReason } from '@material-ui/core'
import MuiAlert, { AlertProps as MuiAlertProps } from '@material-ui/lab/Alert'
import { SyntheticEvent, ReactNode } from 'react'

function Alert(props: MuiAlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

interface AlertProps {
  children: ReactNode
  onClose: (
    event: SyntheticEvent<Element, Event>,
    reason?: SnackbarCloseReason
  ) => void
  open: boolean
}

export interface AlertData {
  open: boolean
  message: string
}

export const ErrorAlert = ({ children, onClose, open }: AlertProps) => (
  <Snackbar
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    open={open}
    autoHideDuration={6000}
    onClose={onClose}
  >
    <Alert onClose={onClose} severity="error">
      {children}
    </Alert>
  </Snackbar>
)

export const SuccessAlert = ({ children, onClose, open }: AlertProps) => (
  <Snackbar
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    open={open}
    autoHideDuration={6000}
    onClose={onClose}
  >
    <Alert onClose={onClose} severity="success">
      {children}
    </Alert>
  </Snackbar>
)
