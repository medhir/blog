import styles from './editable.module.scss'
import { TextareaAutosize } from '@material-ui/core'

interface EditableProps {
  value: string
  className?: string
  multiline?: boolean
  onChange: (e) => void
}

const Editable = ({ value, className, multiline, onChange }: EditableProps) => {
  if (multiline) {
    return (
      <TextareaAutosize
        className={`${styles.editable_input} ${className}`}
        onChange={onChange}
        value={value}
      />
    )
  } else {
    return (
      <input
        className={`${styles.editable_input} ${className}`}
        type="text"
        onChange={onChange}
        value={value}
      />
    )
  }
}

export default Editable
