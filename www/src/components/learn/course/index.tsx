import React, { Component } from 'react'
import http from '../../../utility/http'
import styles from './course.module.scss'
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt'
import { Button } from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save'
import Router from 'next/router'
import { ErrorAlert, SuccessAlert } from '../../alert'
import { AxiosError } from 'axios'
import ContentEditable from 'react-contenteditable'

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
  errorAlert: AlertState
  successAlert: AlertState
}

const Lessons = ({ lessons, onSave }) => (
  <div className={styles.course_lessons}>
    <div className={styles.course_controls}>
      <Button
        variant="contained"
        color="primary"
        size="small"
        startIcon={<SaveIcon />}
        onClick={onSave}
      >
        Save
      </Button>
    </div>
    <h4>📓 Lessons</h4>
    <ul>
      {lessons.map((lesson) => (
        <li>
          <ArrowRightAltIcon />
          <p>{lesson}</p>
        </li>
      ))}
    </ul>
  </div>
)

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
          } = response.data
          this.setState({
            author_id,
            title,
            description,
            created_at,
            updated_at,
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
    }
  }

  render() {
    const { title, description, errorAlert, successAlert } = this.state
    return (
      <section className={styles.course}>
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
          <img src="https://yourbasic.org/golang/square-gopher.png" />
        </div>
        <Lessons
          lessons={['Getting Started', 'Working with the Terminal']}
          onSave={this.saveCourse}
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

export default Course
