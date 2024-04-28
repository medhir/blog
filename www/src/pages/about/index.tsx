import React from "react";

import styles from "./about.module.scss";
import Head from "../../components/head";

const About = () => (
  <>
    <Head title="about.medhir" />
    <section className={styles.about}>
      <p>hello, and welcome to my tiny internet outpost. I&apos;m Medhir.</p>
      <p>
        this website is both a labor of love and a rite of passage amongst
        computer people as a complete blogging platform I coded myself. this
        domain has been the basis to learn and build lots of software skills
        that turned into an entire career.
      </p>
      <p>
        currently, I work as a Senior Product Manager at Microsoft and focus on
        building SDKs that make it easier for enterprises to protect their
        resources through strong, phish-resistant authentication.{" "}
      </p>
      <p>
        you can view some of my work through this site and{" "}
        <a href="https://github.com/medhir">GitHub</a>,
        <a href="https://linkedin.com/in/medhir">LinkedIn</a>,{" "}
        <a href="https://instagram.com/medhir">Instagram</a> or send me an email
        via mail AT medhir.com. thanks for stopping by.
      </p>
    </section>
  </>
);

export default About;
