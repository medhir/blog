import { Component, ChangeEvent } from 'react'
import { v4 as uuid } from 'uuid'
import Preview from './preview'
import styles from './notebook.module.scss'
import http from '../../utility/http'
import { debounce } from 'lodash'
import { IconButton } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import VisibilityIcon from '@material-ui/icons/Visibility'

interface NotebookProps {
  className?: string
  mdx?: string
  scroll: boolean
  onSave: () => void
  handleTextareaChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
}

interface NotebookState {
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
      id: uuid(),
    }
    this.renderMDXToSource = this.renderMDXToSource.bind(this)
    this.setPreview = this.setPreview.bind(this)
    this.unsetPreview = this.unsetPreview.bind(this)
  }

  setPreview() {
    const { mdx, scroll } = this.props
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
        const { mdx, scroll } = this.props
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

  render() {
    const { className, mdx, onSave, handleTextareaChange } = this.props
    const { preview } = this.state
    return (
      <div className={`${styles.notebook} ${className}`}>
        {!preview && (
          <div className={styles.controls}>
            <IconButton size="medium" color="primary" onClick={this.setPreview}>
              <VisibilityIcon />
            </IconButton>
          </div>
        )}
        {preview && (
          <div className={styles.controls}>
            <IconButton size="medium" color="primary" onClick={onSave}>
              <SaveIcon />
            </IconButton>
            <IconButton
              size="medium"
              color="primary"
              onClick={this.unsetPreview}
            >
              <EditIcon />
            </IconButton>
          </div>
        )}
        {!preview && (
          <textarea onChange={handleTextareaChange} value={mdx}></textarea>
        )}
        {preview}
      </div>
    )
  }
}

export default Notebook
