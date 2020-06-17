import Notebook from '../../notebook'
import IDE from '../ide'

import styles from './lesson.module.scss'
import { Component, ChangeEvent } from 'react'
import http from '../../../utility/http'

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
}

interface LessonState {
  id?: string
  courseID?: string
  title?: string
  description?: string
  mdx?: string
  createdAt?: number
  updatedAt?: number
  errorAlert?: AlertState
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
      }
    } else {
      this.state = {
        loading: true,
      }
    }

    this.handleTextareaChange = this.handleTextareaChange.bind(this)
  }

  componentDidMount() {
    const { id } = this.props
    if (id) {
      http.Get(`/lessons/${id}`, { withCredentials: true }).then((response) => {
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

  render() {
    const { mdx } = this.state
    return (
      <div className={styles.lesson}>
        <Notebook
          scroll={true}
          mdx={mdx}
          className={styles.notebook}
          handleTextareaChange={this.handleTextareaChange}
        />
        <IDE className={styles.ide} />
      </div>
    )
  }
}

export default Lesson
