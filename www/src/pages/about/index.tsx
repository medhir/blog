import React from 'react'

import Layout from '../../components/layout'
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
        I previously worked at <a href="https://lightstep.com">LightStep</a>,
        but was unfortunately laid off recently from macro-economic shifts
        caused by COVID-19. If you are currently hiring and are interested in
        chatting, please feel free to send me a message!
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
