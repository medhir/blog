import React, { Component } from 'react';
import './About.css';

class About extends Component {
  render() {
    return (
      <section className="about">
        <p>
          Hello, and welcome to my small internet outpost. I am a Seattle-based
          software engineer currently working at{' '}
          <a href="https://lightstep.com">LightStep</a>.
        </p>
        <p>
          I sometimes like to dabble in visual artistry through photography and
          3D modeling / rendering using{' '}
          <a href="https://blender.org">Blender</a>.
        </p>
        <p>
          My interests span many domains, including web application development,
          biology, graphic design, generative art, and computer science
          education.
        </p>
        <p>
          You can view some of my work through this site and{' '}
          <a href="https://github.com/medhir">Github</a>, connect with me on{' '}
          <a href="https://linkedin.com/in/medhir">LinkedIn</a>, or send me an
          e-mail via mail AT medhir.com.
        </p>
      </section>
    );
  }
}

export default About;
