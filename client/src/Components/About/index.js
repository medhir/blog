import React, { Component } from 'react'
import './About.css'

class About extends Component {
  render() {
    return (
      <section className="about">
        <p>
          Hello, you're visiting Medhir Bhargava's web page. I am a
          Seattle-based software engineer and (sometimes) visual artist.
        </p>
        <p>
          My interests span many domains, including web application development,
          biology, graphic design, generative art, and computer science
          education.
        </p>
        <p>
          I currently work at <a href="https://lightstep.com">LightStep</a>,
          where I spend time building UIs in React and microservices in Go to
          help developers understand large-scale system behavior with
          distributed tracing.
        </p>
        <p>
          You can view some of my work through this site and{' '}
          <a href="https://github.com/medhir">Github</a>, connect with me on{' '}
          <a href="https://linkedin.com/in/medhir">LinkedIn</a>, or send me an{' '}
          e-mail via mail AT medhir.com.
        </p>
        {/* <p>
          Currently available for hire for Seattle-based or remote work. Please{' '}
          <a href="https://s3-us-west-2.amazonaws.com/medhir-blog-dev/R%C3%A9sum%C3%A9+2019.pdf">
            refer to my résumé
          </a>{' '}
          for further information on my previous work.
        </p> */}
      </section>
    )
  }
}

export default About
