import Notebook from '../../notebook'
import IDE from '../ide'

import styles from './lesson.module.scss'
import React, { Component, ChangeEvent } from 'react'
import { Protected } from '../../../utility/http'
import { ErrorAlert, SuccessAlert } from '../../alert'
import { AxiosError } from 'axios'
import { Button } from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save'

export interface LessonMetadata {
  id: string
  course_id: string
  title: string
  mdx: string
  created_at: number
  updated_at?: number
  instance_url: string
}

interface AlertState {
  open: boolean
  message: string
}

interface LessonProps {
  lesson: LessonMetadata
}

interface LessonState {
  mdx: string
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
    this.handleTextareaChange = this.handleTextareaChange.bind(this)
    this.handleErrorAlertClose = this.handleErrorAlertClose.bind(this)
    this.handleSuccessAlertClose = this.handleSuccessAlertClose.bind(this)
    this.saveLesson = this.saveLesson.bind(this)
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

  saveLesson() {
    const { id } = this.props.lesson
    const { mdx } = this.state
    const { getTitle } = this

    const title = getTitle()
    Protected.Client.Patch('/lesson/', {
      lesson_id: id,
      title,
      mdx,
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

  render() {
    const { mdx, errorAlert, successAlert } = this.state
    const { lesson } = this.props
    const {
      articleRef,
      handleTextareaChange,
      handleErrorAlertClose,
      handleSuccessAlertClose,
      saveLesson,
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
            <Button
              variant="contained"
              color="secondary"
              size="small"
              startIcon={<SaveIcon />}
              onClick={saveLesson}
            >
              Save
            </Button>
          </div>
        </div>
        <IDE url={lesson.instance_url} className={styles.ide} />
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
