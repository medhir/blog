import Notebook from '../../notebook'
import IDE from '../ide'

import styles from './lesson.module.scss'
import { Component, ChangeEvent } from 'react'
import { Protected } from '../../../utility/http'
import { ErrorAlert, SuccessAlert } from '../../alert'
import { AxiosError } from 'axios'

export interface LessonMetadata {
  id: string
  course_id: string
  title: string
  description: string
  mdx?: string
  created_at: number
  updated_at: number
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
  title?: string
  description?: string
  mdx?: string
  createdAt?: number
  updatedAt?: number
  errorAlert: AlertState
  successAlert: AlertState
  loading: boolean
}

class Lesson extends Component<LessonProps, LessonState> {
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

    this.handleTextareaChange = this.handleTextareaChange.bind(this)
    this.handleErrorAlertClose = this.handleErrorAlertClose.bind(this)
    this.handleSuccessAlertClose = this.handleSuccessAlertClose.bind(this)
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.saveLesson = this.saveLesson.bind(this)
  }

  handleTextareaChange(e: ChangeEvent<HTMLTextAreaElement>) {
    this.setState({
      mdx: e.target.value,
    })
  }

  handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
    this.setState({
      title: e.target.value,
    })
  }

  handleErrorAlertClose(event?: React.SyntheticEvent, reason?: string) {
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

  handleSuccessAlertClose(event?: React.SyntheticEvent, reason?: string) {
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
    const { title, description, mdx } = this.state

    Protected.Client.Patch('/lessons/', {
      id,
      title,
      description,
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
    return (
      <section className={styles.lesson}>
        <div className={styles.lesson_content}>
          {mdx && (
            <Notebook
              splitPane={false}
              scroll={true}
              mdx={mdx}
              className={styles.notebook}
              handleTextareaChange={this.handleTextareaChange}
            />
          )}
        </div>
        <IDE
          url={`${lesson.instance_url}?folder=/home/coder/project`}
          className={styles.ide}
        />
        {errorAlert.open && (
          <ErrorAlert
            open={errorAlert.open}
            onClose={this.handleErrorAlertClose}
          >
            {errorAlert.message}
          </ErrorAlert>
        )}
        {successAlert.open && (
          <SuccessAlert
            open={successAlert.open}
            onClose={this.handleSuccessAlertClose}
          >
            {successAlert.message}
          </SuccessAlert>
        )}
      </section>
    )
  }
}

export default Lesson
