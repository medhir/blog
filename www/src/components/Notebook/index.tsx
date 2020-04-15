import { Component, ChangeEvent } from 'react'
import Preview from './Preview'
interface NotebookProps {
  mdx?: string
}

interface NotebookState {
  mdx: string
}

class Notebook extends Component<NotebookProps, NotebookState> {
  constructor(props) {
    super(props)
    this.state = {
      mdx: props.mdx,
    }
    this.handleTextareaChange = this.handleTextareaChange.bind(this)
  }

  handleTextareaChange(e: ChangeEvent<HTMLTextAreaElement>) {
    this.setState({ mdx: e.target.innerText })
  }

  render() {
    return (
      <div>
        <textarea onChange={this.handleTextareaChange}></textarea>
        <Preview mdx={this.state.mdx} />
      </div>
    )
  }
}

export default Notebook
