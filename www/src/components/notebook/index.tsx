import { Component, ChangeEvent } from 'react'
import Preview from './preview'
import styles from './notebook.module.scss'
interface NotebookProps {
  mdx?: string
}

interface NotebookState {
  mdx: string
}

class Notebook extends Component<NotebookProps, NotebookState> {
  constructor(props: NotebookProps) {
    super(props)
    this.state = {
      mdx: props.mdx,
    }
    this.handleTextareaChange = this.handleTextareaChange.bind(this)
  }

  handleTextareaChange(e: ChangeEvent<HTMLTextAreaElement>) {
    this.setState({ mdx: e.target.value })
  }

  render() {
    return (
      <div className={styles.notebook}>
        <textarea
          onChange={this.handleTextareaChange}
          value={this.state.mdx}
        ></textarea>
        <Preview mdx={this.state.mdx} />
      </div>
    )
  }
}

export default Notebook
