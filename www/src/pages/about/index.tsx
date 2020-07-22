import React from 'react'

import styles from './about.module.scss'
import Head from '../../components/head'

const About = () => (
  <>
    <Head title="about.medhir" />
    <section className={styles.about}>
      <p>
        Hello, and welcome to my tiny internet outpost. I&apos;m Medhir, a
        Seattle-based software engineer, among other creative endeavors.
      </p>
      <p>
        My interests span many domains, including web application development,
        biology, electrochemistry, graphic design, and computer science
        education.
      </p>
      <p>
        I currently work on cyber-security things at{' '}
        <a href="https://defensestorm.com">DefenseStorm</a>. I am also a member
        of the University of Washington's{' '}
        <a href="https://comotion.uw.edu">CoMotion</a> program, working on
        developing textile-based electrochemcial sensors towards healthcare
        monitoring applications.
      </p>
      <p>
        You can view some of my work through this site and{' '}
        <a href="https://github.com/medhir">GitHub</a>, connect with me on{' '}
        <a href="https://linkedin.com/in/medhir">LinkedIn</a>, or send me an{' '}
        e-mail via mail AT medhir.com.
      </p>
    </section>
  </>
)

export default About
