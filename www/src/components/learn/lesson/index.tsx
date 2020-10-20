import Notebook from '../../notebook'
import IDE from '../ide'

import styles from './lesson.module.scss'
import React, { Component, ChangeEvent, ClipboardEvent, DragEvent } from 'react'
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
  Paper,
  TextField,
  Tooltip,
} from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import DeleteIcon from '@material-ui/icons/Delete'
import FolderIcon from '@material-ui/icons/Folder'
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary'
import SaveIcon from '@material-ui/icons/Save'
import StopIcon from '@material-ui/icons/Stop'

const ImageMIMERegex = /^image\/(p?jpeg|gif|png)$/i
const LoadingText = '![](Uploading...)'

interface LessonAsset {
  lesson_id: string
  name: string
  url: string
}

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
  assets: Array<LessonAsset>
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
  assets: Array<LessonAsset>
  showAssets: boolean
  mdx: string
  folderDialogOpen: boolean
  folderInput: string
  key: number
  errorAlert: AlertState
  successAlert: AlertState
  loading: boolean
}

class Lesson extends Component<LessonProps, LessonState> {
  articleRef: React.RefObject<HTMLElement>

  constructor(props: LessonProps) {
    super(props)
    this.state = {
      assets: props.lesson.assets || [],
      showAssets: false,
      mdx: props.lesson.mdx,
      key: new Date().getTime(),
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
    this.copyToClipboard = this.copyToClipboard.bind(this)
    this.deleteAsset = this.deleteAsset.bind(this)
    this.getTitle = this.getTitle.bind(this)
    this.handleDrop = this.handleDrop.bind(this)
    this.handlePaste = this.handlePaste.bind(this)
    this.handleImageUpload = this.handleImageUpload.bind(this)
    this.handleFolderInputChange = this.handleFolderInputChange.bind(this)
    this.handleTextareaChange = this.handleTextareaChange.bind(this)
    this.handleErrorAlertClose = this.handleErrorAlertClose.bind(this)
    this.handleSuccessAlertClose = this.handleSuccessAlertClose.bind(this)
    this.insertAtCursor = this.insertAtCursor.bind(this)
    this.saveLesson = this.saveLesson.bind(this)
    this.saveFolderName = this.saveFolderName.bind(this)
    this.stopEnvironment = this.stopEnvironment.bind(this)
    this.toggleAssets = this.toggleAssets.bind(this)
  }

  containsImage(dtItems: DataTransferItemList) {
    let containsImage = false
    for (let i = 0; i < dtItems.length; i++) {
      if (ImageMIMERegex.test(dtItems[i].type)) {
        containsImage = true
        break
      }
    }
    return containsImage
  }

  copyToClipboard(url: string) {
    if (!navigator.clipboard) {
      return
    }
    navigator.clipboard
      .writeText(url)
      .then(() => {
        this.setState({
          successAlert: {
            open: true,
            message: 'asset URL copied to clipboard',
          },
        })
      })
      .catch((err) => {
        this.setState({
          errorAlert: {
            open: true,
            message: `could not copy asset URL to clipboard: ${err}`,
          },
        })
      })
  }

  deleteAsset(name: string) {
    const { id } = this.props.lesson
    Protected.Client.Delete(`/lesson_asset/${id}`, {
      params: {
        name,
      },
    })
      .then(() => {
        this.setState(
          {
            successAlert: {
              open: true,
              message: `asset ${name} deleted`,
            },
          },
          () => {
            this.getAssets()
          }
        )
      })
      .catch((error: AxiosError) => {
        this.setState({
          errorAlert: {
            open: true,
            message: `asset delete failure: ${error.response.data}`,
          },
        })
      })
  }

  getAssets() {
    const { id } = this.props.lesson
    Protected.Client.Get(`/lesson_assets/${id}`)
      .then((response) => {
        this.setState({
          assets: response.data || [],
        })
      })
      .catch((error: AxiosError) => {
        this.setState({
          errorAlert: {
            open: true,
            message: `Could not get assets: ${error.response.data}`,
          },
        })
      })
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

  /* image upload methods */

  handleDrop(e: DragEvent<HTMLTextAreaElement>) {
    const items = e.dataTransfer.items
    this.handleImageUpload(e, items)
  }

  handlePaste(e: ClipboardEvent<HTMLTextAreaElement>) {
    const items = e.clipboardData.items
    this.handleImageUpload(e, items)
  }

  handleImageUpload(
    e: DragEvent<HTMLTextAreaElement> | ClipboardEvent<HTMLTextAreaElement>,
    items: DataTransferItemList
  ) {
    const { id } = this.props.lesson
    e.persist()
    // store selection start/end positions, original value
    // @ts-ignore
    const start = e.target.selectionStart
    // @ts-ignore
    const end = e.target.selectionEnd
    // @ts-ignore
    const originalValue = e.target.value

    let blob
    if (this.containsImage(items)) {
      e.preventDefault()
      for (let i = 0; i < items.length; i++) {
        if (ImageMIMERegex.test(items[i].type)) {
          blob = items[i].getAsFile()
          break
        }
      }
      // Set uploading message in textarea
      this.insertAtCursor(start, end, LoadingText, e.target)
      // upload file
      const data = new FormData()
      data.append('photo', blob)
      Protected.Client.Post(`/lesson_asset/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then((response) => {
          // remove loading message
          this.setState(
            {
              mdx: originalValue,
            },
            () => {
              // add new image as markdown
              this.insertAtCursor(
                start,
                end,
                `![write descriptor here](${response.data.url})`,
                e.target,
                true
              )
              // update asset drawer
              this.getAssets()
            }
          )
        })
        .catch((error: AxiosError) => {
          this.setState(
            {
              mdx: originalValue,
            },
            () => {
              this.insertAtCursor(
                start,
                end,
                `Failed to upload image: ${error.response.data}`,
                e.target,
                true
              )
            }
          )
        })
    }
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

  insertAtCursor(start, end, textToInsert, input, lastInsert = false) {
    // get current text of the input
    const value = input.value
    // update the value with new text
    this.setState(
      {
        key: new Date().getTime(),
        mdx: value.slice(0, start) + textToInsert + value.slice(end),
      },
      () => {
        if (lastInsert) {
          // Update cursor position
          input.selectionStart = input.selectionEnd =
            start + textToInsert.length
        }
      }
    )
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

  toggleAssets() {
    const { showAssets } = this.state
    this.setState({
      showAssets: !showAssets,
    })
  }

  render() {
    const {
      assets,
      mdx,
      key,
      folderDialogOpen,
      folderInput,
      errorAlert,
      successAlert,
      showAssets,
    } = this.state
    const { lesson } = this.props
    const {
      articleRef,
      copyToClipboard,
      deleteAsset,
      handleDrop,
      handlePaste,
      handleFolderInputChange,
      handleTextareaChange,
      handleErrorAlertClose,
      handleSuccessAlertClose,
      saveLesson,
      saveFolderName,
      stopEnvironment,
      toggleAssets,
    } = this
    return (
      <section className={styles.lesson}>
        <div className={styles.lesson_content}>
          <Notebook
            articleRef={articleRef}
            key={key}
            splitPane={false}
            scroll={true}
            mdx={mdx}
            handleDrop={handleDrop}
            handlePaste={handlePaste}
            className={styles.notebook}
            handleTextareaChange={handleTextareaChange}
          />
          <div
            className={`${styles.assets} ${
              showAssets ? styles.assets_show : styles.assets_hidden
            }`}
          >
            {assets.map((asset) => {
              return (
                <Paper
                  key={asset.name}
                  elevation={5}
                  className={styles.assets_preview}
                  onClick={() => copyToClipboard(asset.url)}
                >
                  <img src={asset.url} />
                  <IconButton
                    size="medium"
                    className={styles.assets_delete}
                    onClick={() => deleteAsset(asset.name)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Paper>
              )
            })}
          </div>
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
            <Tooltip title="Show Assets">
              <IconButton onClick={toggleAssets}>
                <PhotoLibraryIcon />
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
