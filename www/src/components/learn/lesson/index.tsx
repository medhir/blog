import Notebook from '../../notebook'
import IDE from '../ide'

import styles from './lesson.module.scss'
import { Component, ChangeEvent } from 'react'
import http, { Protected } from '../../../utility/http'
import { ErrorAlert, SuccessAlert } from '../../alert'
import Router from 'next/router'
import { AxiosError } from 'axios'
import Editable from '../../editable'

export interface LessonMetadata {
  id: string
  courseID: string
  title: string
  description: string
  createdAt: number
  updatedAt: number
}

interface AlertState {
  open: boolean
  message: string
}

interface LessonProps {
  id?: string
  courseID: string
}

interface LessonState {
  id?: string
  courseID?: string
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
  constructor(props) {
    super(props)

    // empty state lesson
    if (!props.id) {
      this.state = {
        title: 'New Lesson',
        description: 'New lesson description.',
        mdx: '# New Lesson',
        loading: false,
        errorAlert: {
          open: false,
          message: '',
        },
        successAlert: {
          open: false,
          message: '',
        },
      }
    } else {
      this.state = {
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
    }

    this.handleTextareaChange = this.handleTextareaChange.bind(this)
    this.handleErrorAlertClose = this.handleErrorAlertClose.bind(this)
    this.handleSuccessAlertClose = this.handleSuccessAlertClose.bind(this)
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.saveLesson = this.saveLesson.bind(this)
  }

  componentDidMount() {
    const { id } = this.props
    if (id) {
      Protected.Client.Get(`/lessons/${id}`).then((response) => {
        const {
          id,
          course_id,
          title,
          description,
          mdx,
          created_at,
          updated_at,
        } = response.data
        this.setState({
          id,
          courseID: course_id,
          title,
          description,
          mdx,
          createdAt: created_at,
          updatedAt: updated_at,
          loading: false,
        })
      })
    }
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
    const { id, courseID } = this.props
    const { title, description, mdx } = this.state
    if (id === undefined) {
      Protected.Client.Post('/lessons/', {
        course_id: courseID,
        title,
        description,
        mdx,
      })
        .then((response) => {
          this.setState(
            {
              id: response.data.id,
              successAlert: {
                open: true,
                message: 'Lesson saved successfully',
              },
            },
            () => {
              Router.push(
                `/teach/courses/${courseID}/lesson/${response.data.id}`
              )
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
    } else {
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
  }

  render() {
    const { mdx, title, errorAlert, successAlert } = this.state
    return (
      <section className={styles.lesson}>
        <div className={styles.lesson_content}>
          <Editable
            className={styles.lesson_title}
            value={title}
            onChange={this.handleTitleChange}
          />
          <Notebook
            scroll={true}
            mdx={mdx}
            className={styles.notebook}
            handleTextareaChange={this.handleTextareaChange}
            onSave={this.saveLesson}
          />
        </div>
        <IDE className={styles.ide} />
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
