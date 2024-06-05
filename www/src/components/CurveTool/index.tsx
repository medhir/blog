import React from 'react'
import Curves from './Curves'

import styles from './styles.module.css';

interface CurveToolProps {}
interface CurveToolState {}

class CurveTool extends React.PureComponent<CurveToolProps, CurveToolState> {
  constructor(props: CurveToolProps) {
    super(props)
  }
  
  render() {
    return (
      <section className={styles.CurveTool}>
        <Curves />
      </section>
    )
  }
}

export default CurveTool
