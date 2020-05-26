import { Component, ChangeEvent } from 'react'
import { v4 as uuid } from 'uuid'
import Preview from './preview'
import styles from './notebook.module.scss'
import http from '../../utility/http'
import { debounce } from 'lodash'
import { IconButton } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import VisibilityIcon from '@material-ui/icons/Visibility'

interface NotebookProps {
  className?: string
  mdx?: string
  scroll: boolean
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
    const { scroll } = this.props
    const { mdx } = this.state
    FetchSource(mdx)
      .then((response) => {
        this.setState({
          preview: <Preview scroll={scroll} source={response.data.source} />,
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
        const { scroll } = this.props
        const { mdx } = this.state
        FetchSource(mdx)
          .then((response) => {
            this.setState(
              {
                preview: null,
              },
              () => {
                this.setState({
                  preview: (
                    <Preview scroll={scroll} source={response.data.source} />
                  ),
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
    const { className } = this.props
    const { mdx, preview } = this.state
    return (
      <div className={`${styles.notebook} ${className}`}>
        {!preview && (
          <IconButton
            size="medium"
            color="primary"
            className={styles.button}
            onClick={this.setPreview}
          >
            <VisibilityIcon />
          </IconButton>
        )}
        {preview && (
          <IconButton
            size="medium"
            color="primary"
            className={styles.button}
            onClick={this.unsetPreview}
          >
            <EditIcon />
          </IconButton>
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
