import React from "react";

import styles from "./about.module.scss";
import Head from "../../components/head";

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
        education. I am currently a member of the University of
        Washington&apos;s <a href="https://comotion.uw.edu">CoMotion</a>{" "}
        program, developing electrochemcial sensors on textiles towards health
        monitoring applications.
      </p>
      <p>
        You can view some of my work through this site and{" "}
        <a href="https://github.com/medhir">GitHub</a>, connect with me on{" "}
        <a href="https://linkedin.com/in/medhir">LinkedIn</a>, or send me an{" "}
        email via mail AT medhir.com.
      </p>
      <p>
        I am currently on the job market after being laid off mid-2020 due to
        the impacts of COVID. If you are interested having a discussion about
        working together, please feel free to shoot over a message through email
        or LinkedIn.
      </p>
    </section>
  </>
);

export default About;
