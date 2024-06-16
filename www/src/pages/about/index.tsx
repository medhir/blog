import React from "react";

import styles from "./about.module.scss";
import Head from "../../components/head";

const About = () => (
  <>
    <Head title="about.medhir" />
    <section className={styles.about}>
      <p>hello, and welcome to my tiny internet outpost.</p>
      <p>
        this website is both a labor of love and a rite of passage amongst
        certain computer people as a{" "}
        <a href="https://github.com/medhir/blog">
          blogging platform I wrote myself
        </a>
        .
      </p>
      <p>
        my interests span many domains. the past couple years have been focused
        on things like cybersecurity, weightlifting, woodworking, and{" "}
        <a href="https://www.instagram.com/p/CvTTMNaJoEg/">
          3D texturing / animation
        </a>{" "}
        with <a href="https://www.blender.org">Blender</a>.
      </p>
      <p>
        previous explorations include developing web apps, building large-scale
        distributed systems, making educational computer science content, and
        prototyping electrochemical sensors.
      </p>
      <p>
        currently, I work as a senior product manager at Microsoft and focus on
        building software libraries that make it easier for enterprises to
        protect their resources through strong, phish-resistant authentication.{" "}
      </p>
      <p>
        you can view some of my work through this site,{" "}
        <a href="https://github.com/medhir">github</a>,{" "}
        <a href="https://linkedin.com/in/medhir">linkedin</a>, and{" "}
        <a href="https://www.instagram.com/m.edhir/">instagram</a>. you can
        email via mail AT medhir.com. thanks for stopping by.
      </p>
    </section>
  </>
);

export default About;
