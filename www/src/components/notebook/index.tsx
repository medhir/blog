import { Component, ChangeEvent } from 'react'
import { v4 as uuid } from 'uuid'
import Preview from './preview'
import styles from './notebook.module.scss'

interface NotebookProps {
  mdx?: string
}

interface NotebookState {
  mdx: string
  preview?: JSX.Element
  id: string
  error?: any
}

const Error = ({ error }) => (
  <pre className={styles.error}>{JSON.stringify(error, undefined, 3)}</pre>
)

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
      mdx:
        props.mdx ||
        `# Blog 2.0

<Button>With MDX</Button>
      `,
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
          response
            .json()
            .then((data) => this.setState({ error: <Error error={data} /> }))
        } else {
          response.json().then((data) => {
            this.setState(
              {
                preview: null,
              },
              () => {
                this.setState({
                  preview: <Preview source={data.source} />,
                })
              }
            )
          })
        }
      })
      .catch((err) => {
        this.setState({ error: err })
      })
  }

  handleTextareaChange(e: ChangeEvent<HTMLTextAreaElement>) {
    this.setState(
      {
        mdx: e.target.value,
      },
      () => {
        this.renderMDXToSource()
      }
    )
  }

  render() {
    const { mdx, preview } = this.state
    return (
      <div className={styles.notebook}>
        <textarea onChange={this.handleTextareaChange} value={mdx}></textarea>
        {preview}
      </div>
    )
  }
}

export default Notebook
