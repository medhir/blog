import { Component, ChangeEvent } from 'react'
import { v4 as uuid } from 'uuid'
import Preview from './preview'
import styles from './notebook.module.scss'
import http from '../../utility/http'
import { debounce } from 'lodash'

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
  http.Post('/api/mdx/draft', { mdx }, { baseURL: 'http://localhost:3000' })

class Notebook extends Component<NotebookProps, NotebookState> {
  debouncedRenderMDX: () => void

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
    if (!this.debouncedRenderMDX) {
      this.debouncedRenderMDX = debounce(() => {
        const { mdx } = this.state
        FetchSource(mdx)
          .then((response) => {
            this.setState(
              {
                preview: null,
              },
              () => {
                this.setState({
                  preview: <Preview source={response.data.source} />,
                })
              }
            )
          })
          .catch((err) => {
            this.setState({ error: err })
          })
      }, 250)
    }
    this.debouncedRenderMDX()
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
