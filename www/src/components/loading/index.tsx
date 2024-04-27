import React, { Component } from "react";
import styles from "./index.module.scss";

interface LoadingState {
  loadCount: number;
  intervalID?: NodeJS.Timeout;
}

class Loading extends Component<{}, LoadingState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      loadCount: 0,
    };
  }

  componentDidMount() {
    const intervalID = setInterval(this.updateCount.bind(this), 150);
    this.setState({ intervalID: intervalID });
  }

  componentWillUnmount() {
    const { intervalID } = this.state;
    clearInterval(intervalID);
  }

  updateCount() {
    const { loadCount } = this.state;
    this.setState({ loadCount: loadCount + 1 });
  }

  getEllipsis() {
    const { loadCount } = this.state;
    if (loadCount % 4 === 0) {
      return "";
    } else if (loadCount % 4 === 1) {
      return ".";
    } else if (loadCount % 4 === 2) {
      return "..";
    } else if (loadCount % 4 === 3) {
      return "...";
    }
  }

  render() {
    return (
      <section>
        <h2 className={styles.loading}>Loading{this.getEllipsis()}</h2>
      </section>
    );
  }
}

export default Loading;
