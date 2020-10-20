import Notebook from '../../notebook'
import IDE from '../ide'

import styles from './lesson.module.scss'
import React, { Component, ChangeEvent } from 'react'
import { Protected } from '../../../utility/http'
import { ErrorAlert, SuccessAlert } from '../../alert'
import { AxiosError } from 'axios'
import Router from 'next/router'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
} from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import FolderIcon from '@material-ui/icons/Folder'
import SaveIcon from '@material-ui/icons/Save'
import StopIcon from '@material-ui/icons/Stop'

export interface LessonMetadata {
  id: string
  title: string
}

interface LessonData {
  id: string
  course_id: string
  title: string
  mdx: string
  folder_name?: string
  position: number
  created_at: number
  updated_at?: number
  instance_url: string
  lessons_metadata: Array<LessonMetadata>
}

interface AlertState {
  open: boolean
  message: string
}

interface LessonProps {
  lesson: LessonData
}

interface LessonState {
  mdx: string
  folderDialogOpen: boolean
  folderInput: string
  errorAlert: AlertState
  successAlert: AlertState
  loading: boolean
}

class Lesson extends Component<LessonProps, LessonState> {
  articleRef: React.RefObject<HTMLElement>

  constructor(props: LessonProps) {
    super(props)
    this.state = {
      mdx: props.lesson.mdx,
      folderDialogOpen: false,
      folderInput: props.lesson.folder_name || '/home/coder/project/',
      loading: true,
      errorAlert: {
        open: false,
        message: '',
      },
      successAlert: {
        open: false,
        message: '',
      },
    }

    this.articleRef = React.createRef()
    this.getTitle = this.getTitle.bind(this)
    this.handleFolderInputChange = this.handleFolderInputChange.bind(this)
    this.handleTextareaChange = this.handleTextareaChange.bind(this)
    this.handleErrorAlertClose = this.handleErrorAlertClose.bind(this)
    this.handleSuccessAlertClose = this.handleSuccessAlertClose.bind(this)
    this.saveLesson = this.saveLesson.bind(this)
    this.saveFolderName = this.saveFolderName.bind(this)
    this.stopEnvironment = this.stopEnvironment.bind(this)
  }

  getTitle(): string {
    const { articleRef } = this
    const heading1 = articleRef.current.querySelector('h1')
    let title: string
    if (heading1) {
      title = heading1.innerText
    } else {
      title = `Untitled ${Math.random()}`
    }
    return title
  }

  handleTextareaChange(e: ChangeEvent<HTMLTextAreaElement>) {
    this.setState({
      mdx: e.target.value,
    })
  }

  handleFolderInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      folderInput: e.target.value,
    })
  }

  handleErrorAlertClose(_event?: React.SyntheticEvent, reason?: string) {
    if (reason === 'clickaway') {
      return
    }
    this.setState({
      errorAlert: {
        open: false,
        message: '',
      },
    })
  }

  handleSuccessAlertClose(_event?: React.SyntheticEvent, reason?: string) {
    if (reason === 'clickaway') {
      return
    }
    this.setState({
      successAlert: {
        open: false,
        message: '',
      },
    })
  }

  saveFolderName() {
    const { id } = this.props.lesson
    const { mdx, folderInput } = this.state
    const { getTitle } = this
    const title = getTitle()

    this.setState({
      folderDialogOpen: false,
    })
    Protected.Client.Patch('/lesson/', {
      lesson_id: id,
      title,
      mdx,
      folder_name: folderInput,
    }).then(() => {
      this.setState(
        {
          successAlert: {
            open: true,
            message: 'Lesson folder updated successfully',
          },
        },
        () => {
          location.reload()
        }
      )
    })
  }

  saveLesson() {
    const { id, folder_name } = this.props.lesson
    const { mdx } = this.state
    const { getTitle } = this

    const title = getTitle()
    Protected.Client.Patch('/lesson/', {
      lesson_id: id,
      title,
      mdx,
      folder_name,
    })
      .then(() => {
        this.setState({
          successAlert: {
            open: true,
            message: 'Lesson saved successfully',
          },
        })
      })
      .catch((error: AxiosError) => {
        this.setState({
          errorAlert: {
            open: true,
            message: error.response.data,
          },
        })
      })
  }

  stopEnvironment() {
    Protected.Client.Delete(`/code/`)
      .then(() => {
        this.setState({
          successAlert: {
            open: true,
            message: 'IDE Stopped',
          },
        })
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          this.setState({
            errorAlert: {
              open: true,
              message: error.response.data,
            },
          })
        } else {
          this.setState({
            errorAlert: {
              open: true,
              message: error.message,
            },
          })
        }
      })
  }

  render() {
    const {
      mdx,
      folderDialogOpen,
      folderInput,
      errorAlert,
      successAlert,
    } = this.state
    const { lesson } = this.props
    const {
      articleRef,
      handleFolderInputChange,
      handleTextareaChange,
      handleErrorAlertClose,
      handleSuccessAlertClose,
      saveLesson,
      saveFolderName,
      stopEnvironment,
    } = this
    return (
      <section className={styles.lesson}>
        <div className={styles.lesson_content}>
          <Notebook
            articleRef={articleRef}
            splitPane={false}
            scroll={true}
            mdx={mdx}
            className={styles.notebook}
            handleTextareaChange={handleTextareaChange}
          />
          <div className={styles.lesson_controls}>
            {lesson.position !== 0 && (
              <Tooltip title="Previous Lesson">
                <IconButton
                  onClick={() =>
                    Router.push(
                      `/teach/courses/${lesson.course_id}/lesson/${
                        lesson.lessons_metadata[lesson.position - 1].id
                      }`
                    )
                  }
                >
                  <ArrowBackIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Save Lesson">
              <IconButton onClick={saveLesson}>
                <SaveIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Stop IDE">
              <IconButton onClick={stopEnvironment}>
                <StopIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Update Folder to Open in IDE">
              <IconButton
                onClick={() => this.setState({ folderDialogOpen: true })}
              >
                <FolderIcon />
              </IconButton>
            </Tooltip>
            {lesson.position !== lesson.lessons_metadata.length - 1 && (
              <Tooltip title="Next Lesson">
                <IconButton
                  onClick={() =>
                    Router.push(
                      `/teach/courses/${lesson.course_id}/lesson/${
                        lesson.lessons_metadata[lesson.position + 1].id
                      }`
                    )
                  }
                >
                  <ArrowForwardIcon />
                </IconButton>
              </Tooltip>
            )}
            <Dialog
              open={folderDialogOpen}
              onClose={() => this.setState({ folderDialogOpen: false })}
            >
              <DialogTitle>Open the IDE at a Specific Directory</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Choose the folder that the IDE is opened to when the lesson
                  loads. This must be a valid directory path, otherwise the IDE
                  will return a 500 error on lesson load.
                </DialogContentText>
                <TextField
                  autoFocus
                  required
                  fullWidth
                  label="folder path"
                  value={folderInput}
                  onChange={handleFolderInputChange}
                ></TextField>
              </DialogContent>
              <DialogActions>
                <Button onClick={saveFolderName}>Set Directory</Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
        <IDE
          url={
            lesson.folder_name
              ? `${lesson.instance_url}?folder=${lesson.folder_name}`
              : lesson.instance_url
          }
          className={styles.ide}
        />
        {errorAlert.open && (
          <ErrorAlert open={errorAlert.open} onClose={handleErrorAlertClose}>
            {errorAlert.message}
          </ErrorAlert>
        )}
        {successAlert.open && (
          <SuccessAlert
            open={successAlert.open}
            onClose={handleSuccessAlertClose}
          >
            {successAlert.message}
          </SuccessAlert>
        )}
      </section>
    )
  }
}

export default Lesson
