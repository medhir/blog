import { Component } from 'react'
import Router from 'next/router'

import styles from './courses.module.scss'
import { Container, Card, CardActionArea, CardContent } from '@material-ui/core'
import LibraryAddIcon from '@material-ui/icons/LibraryAdd'
import { CourseMetadata } from '../course'
import { Protected } from '../../../utility/http'
import { AxiosError } from 'axios'

interface CoursesProps {
  courses: Array<CourseMetadata>
}

interface CoursesState {
  error: any
}

export default class Courses extends Component<CoursesProps, CoursesState> {
  constructor(props) {
    super(props)
  }

  render() {
    const { courses } = this.props
    return (
      <Container className={styles.courses}>
        <h2>Your Courses</h2>
        <div className={styles.courses_cards}>
          {courses.map((course) => (
            <Card className={styles.courses_card} key={course.id}>
              <CardActionArea
                onClick={() => {
                  Router.push(`/teach/courses/${course.id}`)
                }}
              >
                <CardContent>
                  <h3>{course.title}</h3>
                  {course.description && <p>{course.description}</p>}
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
          <Card
            className={`${styles.courses_card} ${styles.courses_add_card}`}
            onClick={() => {}}
          >
            <CardActionArea
              style={{
                height: '100%',
              }}
              onClick={() => {
                Protected.Client.Post('/course/', {
                  title: 'Course Template',
                  description: 'Enter Description',
                })
                  .then((response) => {
                    Router.push(`/teach/courses/${response.data.id}`)
                  })
                  .catch((error: AxiosError) => {
                    console.error(error)
                  })
              }}
            >
              <CardContent>
                <LibraryAddIcon />
                <h5>Add Course</h5>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>
      </Container>
    )
  }
}
