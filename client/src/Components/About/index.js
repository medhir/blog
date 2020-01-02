import React, { Component } from 'react'
import './About.css'

class About extends Component {
  render() {
    return (
      <section className="about">
        <p>
          Hello, and welcome to my (small) internet outpost. I&apos;m Medhir, a
          Seattle-based software engineer and (sometimes) visual artist.
        </p>
        <p>
          My interests span many domains, including web application development,
          biology, graphic design, generative art, and computer science
          education.
        </p>
        <p>
          I currently work at <a href="https://lightstep.com">LightStep</a>,
          taking a deep dive on distributed systems and implementing tools to
          help understand large-scale system behavior with distributed tracing.
        </p>
        <p>
          You can view some of my work through this site and{' '}
          <a href="https://github.com/medhir">GitHub</a>, connect with me on{' '}
          <a href="https://linkedin.com/in/medhir">LinkedIn</a>, or send me an{' '}
          e-mail via mail AT medhir.com.
        </p>
      </section>
    )
  }
}

export default About
