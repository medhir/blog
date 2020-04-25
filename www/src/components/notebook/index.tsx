import { Component, ChangeEvent } from 'react'
import { v4 as uuid } from 'uuid'
import Preview from './preview'
import styles from './notebook.module.scss'

interface NotebookProps {
  mdx?: string
}

interface NotebookState {
  mdx: string
  validatedMDX?: string
  id: string
}

class Notebook extends Component<NotebookProps, NotebookState> {
  constructor(props: NotebookProps) {
    super(props)
    this.state = {
      mdx:
        props.mdx ||
        `const Button = ({children}) => <button style={{color: 'red'}}>{children}</button>`,
      id: uuid(),
    }
    this.handleTextareaChange = this.handleTextareaChange.bind(this)
  }

  handleTextareaChange(e: ChangeEvent<HTMLTextAreaElement>) {
    this.setState({ mdx: e.target.value })
  }

  componentWillUnmount() {
    const { id } = this.state
    fetch('/api/mdx/draft', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
      }),
    }).catch((err) => console.error(err))
  }

  render() {
    const { mdx, validatedMDX, id } = this.state
    return (
      <div className={styles.notebook}>
        <textarea onChange={this.handleTextareaChange} value={mdx}></textarea>
        <Preview mdx={mdx} id={id} />
      </div>
    )
  }
}

export default Notebook
