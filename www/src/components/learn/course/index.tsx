import React, { Component } from 'react'
import http from '../../../utility/http'
import styles from './course.module.scss'
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt'
import { Button } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import SaveIcon from '@material-ui/icons/Save'
import Router from 'next/router'
import { ErrorAlert, SuccessAlert } from '../../alert'
import { AxiosError } from 'axios'
import ContentEditable from 'react-contenteditable'
import { LessonMetadata } from '../lesson'

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
  id?: string
  author_id?: string
}

interface CourseState {
  id?: string
  author_id: string
  title: string
  description?: string
  created_at?: number
  updated_at?: number
  lessons: Array<LessonMetadata>
  errorAlert: AlertState
  successAlert: AlertState
}

class Course extends Component<CourseProps, CourseState> {
  titleRef: React.RefObject<HTMLElement>
  descriptionRef: React.RefObject<HTMLElement>

  constructor(props: CourseProps) {
    super(props)
    this.state = {
      id: props.id || '',
      author_id: '',
      title: 'New Course',
      description: 'Write a description for your course.',
      lessons: [],
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

  componentDidMount() {
    const { id } = this.state
    if (id !== '') {
      http
        .Get(`/courses/${id}`, { withCredentials: true })
        .then((response) => {
          const {
            author_id,
            title,
            description,
            created_at,
            updated_at,
          } = response.data.metadata
          this.setState({
            author_id,
            title,
            description,
            created_at,
            updated_at,
            lessons: response.data.lessons,
          })
        })
        .catch((error) => {
          this.setState({
            errorAlert: {
              open: true,
              message: error.response.data,
            },
          })
        })
    }
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
    const { author_id, id, title, description } = this.state
    if (id === '') {
      // create a new course
      http
        .Post(
          '/courses/',
          {
            title,
            description,
          },
          { withCredentials: true }
        )
        .then((response) => {
          Router.push(`/teach/courses/${response.data}`)
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
      // update the course
      http
        .Patch(
          '/courses/',
          {
            author_id,
            id,
            title,
            description,
          },
          { withCredentials: true }
        )
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
  }

  render() {
    const {
      id,
      title,
      description,
      lessons,
      errorAlert,
      successAlert,
    } = this.state
    return (
      <section className={styles.course}>
        <div className={styles.course_image}>
          <img src="https://yourbasic.org/golang/square-gopher.png" />
        </div>
        <div className={styles.course_description}>
          <header>
            <ContentEditable
              innerRef={this.titleRef}
              html={title}
              onChange={this.handleTitleInput}
              tagName="h2"
            />
            <ContentEditable
              innerRef={this.descriptionRef}
              html={description}
              onChange={this.handleDescriptionInput}
              tagName="p"
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
                onClick={() => Router.push(`/teach/courses/${id}/lesson/new`)}
              >
                New Lesson
              </Button>
            </div>
            <ul>
              {lessons.map((lesson) => (
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
