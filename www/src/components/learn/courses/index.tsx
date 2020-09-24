import { Component } from 'react'
import http, { Protected } from '../../../utility/http'
import Router from 'next/router'

import styles from './courses.module.scss'
import Loading from '../../loading'
import { Card, CardActionArea, CardContent } from '@material-ui/core'
import LibraryAddIcon from '@material-ui/icons/LibraryAdd'
import { CourseMetadata } from '../course'

interface CoursesProps {
  courses: Array<CourseMetadata>
}

interface CoursesState {
  error: any
}

export default class Courses extends Component<CoursesProps, CoursesState> {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
    }
  }

  render() {
    const { courses } = this.props
    const { error } = this.state
    return (
      <>
        {
          courses ? (
            <section className={styles.courses}>
              <h2>Courses</h2>
              {error && JSON.stringify(error, null, 3)}
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
                      Router.push('/teach/courses/new')
                    }}
                  >
                    <CardContent>
                      <LibraryAddIcon />
                      <h5>Add Course</h5>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </div>
            </section>
          ) : (
            <Loading />
          ) // show loader when courses are being fetched
        }
      </>
    )
  }
}
