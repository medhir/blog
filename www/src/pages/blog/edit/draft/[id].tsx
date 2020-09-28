import { GetServerSideProps } from 'next'
import Router from 'next/router'
import http, { Protected } from '../../../../utility/http'
import Notebook from '../../../../components/notebook'
import styles from './draft.module.scss'
import { Authenticated } from '../../../../utility/auth'
import { Roles } from '../../../../components/auth'
import Login from '../../../../components/auth/login'
import { ChangeEvent, Component, ClipboardEvent, DragEvent } from 'react'
import {
  AlertData,
  ErrorAlert,
  SuccessAlert,
} from '../../../../components/alert'
import React from 'react'
import { AxiosError } from 'axios'
import { Button, IconButton, Paper } from '@material-ui/core'

import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary'
import SaveIcon from '@material-ui/icons/Save'
import PublishIcon from '@material-ui/icons/Publish'
import DeleteIcon from '@material-ui/icons/Delete'

const ImageMIMERegex = /^image\/(p?jpeg|gif|png)$/i
const LoadingText = '![](Uploading...)'

interface Asset {
  post_id: string
  name: string
  url: string
}

interface DraftEditorProps {
  auth: boolean
  id: string
  mdx: string
}

interface DraftEditorState {
  assets: Array<Asset>
  key: number
  mdx: string
  mobile: boolean
  showAssets: boolean
  errorAlert: AlertData
  successAlert: AlertData
}

class DraftEditor extends Component<DraftEditorProps, DraftEditorState> {
  articleRef: React.RefObject<HTMLElement>
  constructor(props: DraftEditorProps) {
    super(props)
    this.state = {
      assets: [],
      key: new Date().getTime(),
      mdx: props.mdx,
      mobile: false,
      showAssets: false,
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
    this.checkIfMobile = this.checkIfMobile.bind(this)
    this.closeErrorAlert = this.closeErrorAlert.bind(this)
    this.closeSuccessAlert = this.closeSuccessAlert.bind(this)
    this.copyToClipboard = this.copyToClipboard.bind(this)
    this.getAssets = this.getAssets.bind(this)
    this.handleDrop = this.handleDrop.bind(this)
    this.handlePaste = this.handlePaste.bind(this)
    this.handleImageUpload = this.handleImageUpload.bind(this)
    this.handleTextareaChange = this.handleTextareaChange.bind(this)
    this.deleteAsset = this.deleteAsset.bind(this)
    this.deleteDraft = this.deleteDraft.bind(this)
    this.saveDraft = this.saveDraft.bind(this)
    this.toggleAssets = this.toggleAssets.bind(this)
  }

  componentDidMount() {
    this.checkIfMobile()
    window.addEventListener('resize', this.checkIfMobile)
    this.getAssets()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkIfMobile)
  }

  checkIfMobile() {
    if (window.innerWidth < 600) {
      this.setState({
        mobile: true,
      })
    } else {
      this.setState({
        mobile: false,
      })
    }
  }

  closeSuccessAlert() {
    this.setState({
      successAlert: {
        open: false,
        message: '',
      },
    })
  }

  closeErrorAlert() {
    this.setState({
      errorAlert: {
        open: false,
        message: '',
      },
    })
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

  getAssets() {
    const { id } = this.props
    Protected.Client.Get(`/blog/assets/${id}`)
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
    const { id } = this.props
    e.persist()
    // store selection start/end positions, original value
    const start = e.target.selectionStart
    const end = e.target.selectionEnd
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
      Protected.Client.Post(`/blog/asset/${id}`, data, {
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

  deleteAsset(name: string) {
    const { id } = this.props
    Protected.Client.Delete(`/blog/asset/${id}`, {
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

  handleTextareaChange(e: ChangeEvent<HTMLTextAreaElement>) {
    this.setState({
      mdx: e.target.value,
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

  deleteDraft() {
    const { id } = this.props
    Protected.Client.Delete(`/blog/draft/${id}`)
      .then(() => {
        this.setState(
          {
            successAlert: {
              open: true,
              message: 'draft successfully deleted',
            },
          },
          () => {
            Router.push('/blog/edit')
          }
        )
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

  saveDraft() {
    const { id } = this.props
    const { mdx } = this.state
    const { articleRef } = this
    // get title
    const heading1 = articleRef.current.querySelector('h1')
    let title: string
    if (heading1) {
      title = heading1.innerText
    } else {
      title = `Untitled ${Math.random()}`
    }
    Protected.Client.Patch(`/blog/draft/${id}`, {
      title: title,
      markdown: mdx,
    })
      .then(() => {
        this.setState({
          successAlert: {
            open: true,
            message: 'draft successfully saved',
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

  toggleAssets() {
    const { showAssets } = this.state
    this.setState({
      showAssets: !showAssets,
    })
  }

  render() {
    const { auth } = this.props
    const {
      assets,
      key,
      mdx,
      mobile,
      showAssets,
      errorAlert,
      successAlert,
    } = this.state
    const {
      articleRef,
      closeErrorAlert,
      closeSuccessAlert,
      copyToClipboard,
      handleDrop,
      handlePaste,
      handleTextareaChange,
      deleteAsset,
      saveDraft,
      deleteDraft,
    } = this
    if (auth) {
      return (
        <div className={styles.draft}>
          <div className={styles.controls}>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              startIcon={<PhotoLibraryIcon />}
              onClick={this.toggleAssets}
            >
              {showAssets ? 'Hide Assets' : 'Show Assets'}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              startIcon={<SaveIcon />}
              onClick={saveDraft}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={deleteDraft}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<PublishIcon />}
            >
              Publish
            </Button>
          </div>
          <div
            className={`${styles.assets} ${
              showAssets ? styles.assets_show : styles.assets_hidden
            }`}
          >
            {assets.map((asset) => {
              return (
                <Paper
                  key={asset.name}
                  elevation={1}
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
          <Notebook
            articleRef={articleRef}
            key={key}
            splitPane={!mobile}
            scroll={false}
            mdx={mdx}
            handleDrop={handleDrop}
            handlePaste={handlePaste}
            handleTextareaChange={handleTextareaChange}
          />
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
        </div>
      )
    } else {
      return <Login role={Roles.BlogOwner} />
    }
  }
}

export default DraftEditor

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const authResponse = await Authenticated(ctx, Roles.BlogOwner)

  if (authResponse.auth) {
    const draftResponse = await http.Get(`/blog/draft/${ctx.params.id}`, {
      headers: { cookie: authResponse.cookies },
    })
    return {
      props: {
        auth: authResponse.auth,
        id: ctx.params.id,
        mdx: draftResponse.data.markdown,
      },
    }
  } else {
    return {
      props: {
        auth: false,
      },
    }
  }
}
