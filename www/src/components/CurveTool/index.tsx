import React from 'react'
import Curves from './Curves'

import styles from './styles.module.css'

class CurveTool extends React.PureComponent {
  render() {
    return (
      <section className={styles.CurveTool}>
        <Curves gridSize={25} />
      </section>
    )
  }
}

export default CurveTool
