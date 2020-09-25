import { GetServerSideProps } from 'next'
import Marked from 'marked'
import http, { Protected } from '../../../../utility/http'
import Notebook from '../../../../components/notebook'
import styles from './draft.module.scss'
import { Authenticated } from '../../../../utility/auth'
import { Roles } from '../../../../components/auth'
import Login from '../../../../components/auth/login'
import { ChangeEvent, Component } from 'react'
import {
  AlertData,
  ErrorAlert,
  SuccessAlert,
} from '../../../../components/alert'
import React from 'react'
import { AxiosError } from 'axios'
import { Button } from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save'
import PublishIcon from '@material-ui/icons/Publish'

interface DraftEditorProps {
  auth: boolean
  id: string
  mdx: string
}

interface DraftEditorState {
  mdx: string
  errorAlert: AlertData
  successAlert: AlertData
}

class DraftEditor extends Component<DraftEditorProps, DraftEditorState> {
  articleRef: React.RefObject<HTMLElement>
  constructor(props: DraftEditorProps) {
    super(props)
    this.state = {
      mdx: props.mdx,
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
    this.closeErrorAlert = this.closeErrorAlert.bind(this)
    this.closeSuccessAlert = this.closeSuccessAlert.bind(this)
    this.handleTextareaChange = this.handleTextareaChange.bind(this)
    this.save = this.save.bind(this)
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

  handleTextareaChange(e: ChangeEvent<HTMLTextAreaElement>) {
    this.setState({
      mdx: e.target.value,
    })
  }

  save() {
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

  render() {
    const { auth } = this.props
    const { mdx, errorAlert, successAlert } = this.state
    const {
      articleRef,
      closeErrorAlert,
      closeSuccessAlert,
      handleTextareaChange,
      save,
    } = this
    if (auth) {
      return (
        <div className={styles.draft}>
          <div className={styles.controls}>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              startIcon={<SaveIcon />}
              onClick={save}
            >
              Save
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
          <Notebook
            articleRef={articleRef}
            splitPane={true}
            scroll={false}
            mdx={mdx}
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
