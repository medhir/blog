import { Component, ChangeEvent } from 'react'
import { v4 as uuid } from 'uuid'
import Preview from './preview'
import styles from './notebook.module.scss'

interface NotebookProps {
  mdx?: string
}

interface NotebookState {
  mdx: string
  mdxSource?: string
  id: string
  error?: any
}

const FetchSource = (mdx: string) =>
  fetch('/api/mdx/draft', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mdx,
    }),
  })

class Notebook extends Component<NotebookProps, NotebookState> {
  constructor(props: NotebookProps) {
    super(props)
    this.state = {
      mdx: props.mdx || `<Button>Hello, world!</Button>`,
      id: uuid(),
    }
    this.handleTextareaChange = this.handleTextareaChange.bind(this)
    this.renderMDXToSource = this.renderMDXToSource.bind(this)
  }

  componentDidMount() {
    this.renderMDXToSource()
  }

  renderMDXToSource() {
    const { mdx } = this.state
    FetchSource(mdx)
      .then((response) => {
        if (!response.ok) {
          response.json().then((data) => this.setState({ error: data }))
        } else {
          response
            .json()
            .then((data) =>
              this.setState({ mdxSource: data.source, error: false })
            )
        }
      })
      .catch((err) => {
        this.setState({ error: err })
      })
  }

  handleTextareaChange(e: ChangeEvent<HTMLTextAreaElement>) {
    this.setState({ mdx: e.target.value }, () => {
      this.renderMDXToSource()
    })
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
    const { mdx, mdxSource, error } = this.state
    return (
      <div className={styles.notebook}>
        <textarea onChange={this.handleTextareaChange} value={mdx}></textarea>
        <Preview key={mdxSource} source={mdxSource} error={error} />
      </div>
    )
  }
}

export default Notebook
