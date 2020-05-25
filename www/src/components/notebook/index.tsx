import { Component, ChangeEvent } from 'react'
import { v4 as uuid } from 'uuid'
import Preview from './preview'
import styles from './notebook.module.scss'
import http from '../../utility/http'
import { debounce } from 'lodash'
import { Button } from '@material-ui/core'

interface NotebookProps {
  mdx?: string
}

interface NotebookState {
  mdx: string
  preview?: JSX.Element
  id: string
  error?: any
}

const FetchSource = (mdx: string) =>
  // we unset the baseURL since this is a node api driven by the next framework
  http.Post('/api/mdx/draft', { mdx }, { baseURL: '' })

class Notebook extends Component<NotebookProps, NotebookState> {
  debouncedRenderMDX: () => void

  constructor(props: NotebookProps) {
    super(props)
    this.state = {
      mdx: props.mdx || '',
      id: uuid(),
    }
    this.handleTextareaChange = this.handleTextareaChange.bind(this)
    this.renderMDXToSource = this.renderMDXToSource.bind(this)
    this.setPreview = this.setPreview.bind(this)
    this.unsetPreview = this.unsetPreview.bind(this)
  }

  setPreview() {
    const { mdx } = this.state
    FetchSource(mdx)
      .then((response) => {
        this.setState({
          preview: <Preview source={response.data.source} />,
        })
      })
      .catch((err) => {
        console.error(err)
      })
  }

  unsetPreview() {
    this.setState({
      preview: null,
    })
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
    this.setState({
      mdx: e.target.value,
    })
  }

  render() {
    const { mdx, preview } = this.state
    return (
      <div className={styles.notebook}>
        {!preview && (
          <Button
            className={styles.button}
            variant="contained"
            color="primary"
            onClick={this.setPreview}
          >
            Preview
          </Button>
        )}
        {preview && (
          <Button
            className={styles.button}
            variant="contained"
            color="secondary"
            onClick={this.unsetPreview}
          >
            Edit
          </Button>
        )}
        {!preview && (
          <textarea onChange={this.handleTextareaChange} value={mdx}></textarea>
        )}
        {preview}
      </div>
    )
  }
}

export default Notebook
