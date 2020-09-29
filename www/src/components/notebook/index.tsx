import { Component, ChangeEvent, ClipboardEvent, DragEvent } from 'react'
import { v4 as uuid } from 'uuid'
import Preview from './preview'
import styles from './notebook.module.scss'
import http from '../../utility/http'
import { debounce } from 'lodash'
import { IconButton } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import VisibilityIcon from '@material-ui/icons/Visibility'

interface NotebookProps {
  articleRef?: React.RefObject<HTMLElement>
  className?: string
  mdx: string
  scroll: boolean
  splitPane: boolean
  handleTextareaChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  handleDrop?: (e: DragEvent<HTMLTextAreaElement>) => void
  handlePaste?: (e: ClipboardEvent<HTMLTextAreaElement>) => void
}

interface NotebookState {
  iMDX: string
  parsedMDX: string
  preview: boolean
  id: string
  error?: any
}

const FetchSource = (mdx: string) =>
  // we unset the baseURL since this is a node api driven by the Next framework rather than the Go server
  http.Post('/api/mdx/draft', { mdx }, { baseURL: '' })

class Notebook extends Component<NotebookProps, NotebookState> {
  debouncedRenderMDX: () => void

  constructor(props: NotebookProps) {
    super(props)
    this.state = {
      iMDX: props.mdx,
      id: uuid(),
      preview: false,
      parsedMDX: '',
    }
    this.onTextareaChange = this.onTextareaChange.bind(this)
    this.renderMDXToSource = this.renderMDXToSource.bind(this)
    this.togglePreview = this.togglePreview.bind(this)
  }

  componentDidMount() {
    const { mdx } = this.props
    FetchSource(mdx)
      .then((response) => {
        this.setState({
          parsedMDX: response.data.source,
        })
      })
      .catch((err) => {
        this.setState({ error: err })
      })
  }

  onTextareaChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const { handleTextareaChange } = this.props
    handleTextareaChange(e)
    this.setState(
      {
        iMDX: e.target.value,
      },
      () => {
        this.renderMDXToSource()
      }
    )
  }

  renderMDXToSource() {
    if (!this.debouncedRenderMDX) {
      this.debouncedRenderMDX = debounce(() => {
        const { mdx } = this.props
        FetchSource(mdx)
          .then((response) => {
            this.setState(
              {
                preview: null,
              },
              () => {
                this.setState({
                  parsedMDX: response.data.source,
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

  togglePreview() {
    const { preview } = this.state
    this.setState({
      preview: !preview,
    })
  }

  render() {
    const {
      articleRef,
      className,
      scroll,
      splitPane,
      handleDrop,
      handlePaste,
    } = this.props
    const { iMDX, parsedMDX, preview } = this.state
    const { onTextareaChange, togglePreview } = this
    if (splitPane) {
      return (
        <div className={`${styles.notebook} ${className}`}>
          <textarea
            className={`${styles.textarea} ${styles.textarea_splitpane}`}
            onChange={onTextareaChange}
            onDrop={handleDrop}
            onPaste={handlePaste}
            value={iMDX}
          ></textarea>
          <Preview articleRef={articleRef} scroll={scroll} source={parsedMDX} />
        </div>
      )
    }
    return (
      <div className={`${styles.notebook} ${className}`}>
        {!preview && (
          <div className={styles.controls}>
            <IconButton size="medium" color="primary" onClick={togglePreview}>
              <VisibilityIcon />
            </IconButton>
          </div>
        )}
        {preview && (
          <div className={styles.controls}>
            <IconButton size="medium" color="primary" onClick={togglePreview}>
              <EditIcon />
            </IconButton>
          </div>
        )}
        {!preview && (
          <textarea
            className={`${styles.textarea}`}
            onChange={onTextareaChange}
            value={iMDX}
          ></textarea>
        )}
        {preview && (
          <Preview articleRef={articleRef} scroll={scroll} source={parsedMDX} />
        )}
      </div>
    )
  }
}

export default Notebook
