import Notebook from '../../notebook'
import IDE from '../ide'

import styles from './lesson.module.scss'

const Lesson = () => {
  return (
    <div className={styles.lesson}>
      <Notebook
        mdx={`# your first Go program

Programs in go are written in text files that end in the \`.go\` file extension. 

Go programs consist of *packages*, and each Go program must at minimum contain a \`main\` package. 

Within the \`main\` package there must be at least one *function* to describe how the program is executed. This function is also named \`main\`: 

\`\`\`go
func main() {
// the code written here will be executed 
// when the program is run
}
\`\`\`

Now, within the editor, look for a file called \`hello.go\`. Within this file, add the following statement within the \`main()\` method: 

\`\`\`go
fmt.Println("Hello, world!")
\`\`\``}
        className={styles.notebook}
      />
      <IDE className={styles.ide} />
    </div>
  )
}

export default Lesson
