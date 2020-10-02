import React, { Component } from 'react'
import { Protected } from '../../../utility/http'
import styles from './course.module.scss'
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt'
import { Button } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import SaveIcon from '@material-ui/icons/Save'
import Router from 'next/router'
import { ErrorAlert, SuccessAlert } from '../../alert'
import { AxiosError } from 'axios'
import Lesson, { LessonMetadata } from '../lesson'
import Editable from '../../editable'

interface AlertState {
  open: boolean
  message: string
}

export interface CourseMetadata {
  id: string
  author_id: string
  title: string
  description?: string
  created_at: number
  updated_at?: number
}

interface CourseProps {
  metadata: CourseMetadata
  lessons: Array<LessonMetadata>
}

interface CourseState {
  title: string
  description?: string
  errorAlert: AlertState
  successAlert: AlertState
}

class Course extends Component<CourseProps, CourseState> {
  titleRef: React.RefObject<HTMLElement>
  descriptionRef: React.RefObject<HTMLElement>

  constructor(props: CourseProps) {
    super(props)
    this.state = {
      title: props.metadata.title,
      description: props.metadata.description,
      errorAlert: {
        open: false,
        message: '',
      },
      successAlert: {
        open: false,
        message: '',
      },
    }

    this.titleRef = React.createRef()
    this.descriptionRef = React.createRef()

    this.handleDescriptionInput = this.handleDescriptionInput.bind(this)
    this.handleErrorAlertClose = this.handleErrorAlertClose.bind(this)
    this.handleSuccessAlertClose = this.handleSuccessAlertClose.bind(this)
    this.handleTitleInput = this.handleTitleInput.bind(this)
    this.saveCourse = this.saveCourse.bind(this)
  }

  handleDescriptionInput(e) {
    this.setState({
      description: e.target.value,
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

  handleTitleInput(e) {
    this.setState({
      title: e.target.value,
    })
  }

  saveCourse() {
    const { id, author_id } = this.props.metadata
    const { title, description } = this.state

    Protected.Client.Patch('/course/', {
      author_id,
      id,
      title,
      description,
    })
      .then(() => {
        this.setState({
          successAlert: {
            open: true,
            message: 'Course saved successfully!',
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
    const { id } = this.props.metadata
    const { lessons } = this.props
    const { title, description, errorAlert, successAlert } = this.state
    return (
      <section className={styles.course}>
        <div className={styles.course_image}>
          <img src="https://yourbasic.org/golang/square-gopher.png" />
        </div>
        <div className={styles.course_description}>
          <header>
            <Editable
              className={styles.course_editableH1}
              value={title}
              multiline
              onChange={this.handleTitleInput}
            />
            <Editable
              className={styles.course_editableP}
              value={description}
              multiline
              onChange={this.handleDescriptionInput}
            />
          </header>
          <div className={styles.course_controls}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<SaveIcon />}
              onClick={this.saveCourse}
            >
              Save
            </Button>
          </div>
          <div className={styles.lessons}>
            <div className={styles.lessons_header}>
              <h4>📓 Lessons</h4>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                startIcon={<AddCircleIcon />}
                onClick={() => {
                  Protected.Client.Post('/lesson/', {
                    course_id: id,
                    title: 'New Lesson',
                    mdx: '# New Lesson',
                  })
                    .then((response) => {
                      Router.push(
                        `/teach/courses/${id}/lesson/${response.data.lesson_id}`
                      )
                    })
                    .catch((error: AxiosError) => {
                      this.setState({
                        errorAlert: {
                          open: true,
                          message: error.response!!.data,
                        },
                      })
                    })
                }}
              >
                New Lesson
              </Button>
            </div>
            <ul>
              {lessons &&
                lessons.map((lesson) => (
                  <li
                    key={lesson.id}
                    onClick={() =>
                      Router.push(`/teach/courses/${id}/lesson/${lesson.id}`)
                    }
                  >
                    <ArrowRightAltIcon />
                    <p>{lesson.title}</p>
                  </li>
                ))}
            </ul>
          </div>
        </div>
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

export default Course
