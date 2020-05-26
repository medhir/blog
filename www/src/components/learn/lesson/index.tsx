import Notebook from '../../notebook'
import IDE from '../ide'

import styles from './lesson.module.scss'

const Lesson = () => {
  return (
    <div className={styles.lesson}>
      <Notebook
        scroll={true}
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
\`\`\`

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ipsum consequat nisl vel pretium. At imperdiet dui accumsan sit amet nulla. Bibendum ut tristique et egestas quis ipsum suspendisse. Posuere urna nec tincidunt praesent semper feugiat nibh sed. Nibh mauris cursus mattis molestie a. Habitant morbi tristique senectus et netus et. Id ornare arcu odio ut sem nulla. Vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi. Quam lacus suspendisse faucibus interdum. Quis eleifend quam adipiscing vitae proin sagittis nisl. Diam maecenas sed enim ut sem viverra aliquet eget. Pulvinar sapien et ligula ullamcorper. Gravida arcu ac tortor dignissim convallis aenean. Urna nec tincidunt praesent semper feugiat. Nec tincidunt praesent semper feugiat nibh sed pulvinar proin gravida. Cras adipiscing enim eu turpis.

Neque viverra justo nec ultrices dui sapien eget. Ut placerat orci nulla pellentesque dignissim enim sit amet venenatis. Malesuada pellentesque elit eget gravida cum sociis natoque penatibus. Diam quis enim lobortis scelerisque fermentum dui faucibus. Massa sapien faucibus et molestie ac feugiat sed lectus. Sodales neque sodales ut etiam. Non enim praesent elementum facilisis leo vel. Donec pretium vulputate sapien nec sagittis aliquam. Feugiat sed lectus vestibulum mattis ullamcorper velit sed. Mi sit amet mauris commodo quis imperdiet massa tincidunt.

Lectus urna duis convallis convallis tellus id interdum velit laoreet. Risus pretium quam vulputate dignissim suspendisse in est. Id porta nibh venenatis cras sed. Vestibulum rhoncus est pellentesque elit ullamcorper dignissim cras tincidunt lobortis. Varius vel pharetra vel turpis nunc eget lorem dolor. Proin fermentum leo vel orci porta non. Ut tellus elementum sagittis vitae et. Est placerat in egestas erat imperdiet sed. Nulla porttitor massa id neque aliquam. Tincidunt vitae semper quis lectus nulla. Nibh sed pulvinar proin gravida. Suspendisse ultrices gravida dictum fusce ut placerat orci. Faucibus ornare suspendisse sed nisi lacus sed. Metus vulputate eu scelerisque felis. Turpis egestas pretium aenean pharetra magna ac. Aliquam sem et tortor consequat id porta nibh venenatis. Eget lorem dolor sed viverra. Tortor at auctor urna nunc id cursus metus. At quis risus sed vulputate odio. Odio ut sem nulla pharetra diam sit amet nisl.

Eros in cursus turpis massa. Accumsan in nisl nisi scelerisque. Elementum curabitur vitae nunc sed. Nulla aliquet porttitor lacus luctus accumsan. Lectus proin nibh nisl condimentum id. Augue neque gravida in fermentum. Sapien nec sagittis aliquam malesuada bibendum. Duis at tellus at urna condimentum mattis pellentesque id nibh. Id nibh tortor id aliquet lectus proin nibh nisl. Ut venenatis tellus in metus vulputate eu scelerisque felis imperdiet. Sed adipiscing diam donec adipiscing tristique risus. Lectus sit amet est placerat in egestas erat imperdiet sed. Semper risus in hendrerit gravida rutrum quisque non tellus. Sollicitudin nibh sit amet commodo nulla facilisi nullam vehicula. Iaculis eu non diam phasellus. Molestie ac feugiat sed lectus vestibulum mattis ullamcorper velit. Diam vulputate ut pharetra sit. Urna porttitor rhoncus dolor purus non enim.

Rutrum quisque non tellus orci ac auctor. Leo vel fringilla est ullamcorper eget nulla. Cras adipiscing enim eu turpis egestas pretium. Ullamcorper malesuada proin libero nunc consequat interdum varius. Nulla posuere sollicitudin aliquam ultrices. Duis tristique sollicitudin nibh sit amet commodo nulla. Leo urna molestie at elementum eu facilisis sed odio morbi. Massa eget egestas purus viverra accumsan in. Tortor posuere ac ut consequat semper. Pretium quam vulputate dignissim suspendisse in est. Dignissim suspendisse in est ante. Quis varius quam quisque id. Placerat duis ultricies lacus sed turpis tincidunt id. Elit pellentesque habitant morbi tristique senectus et netus et malesuada. Dictum fusce ut placerat orci nulla pellentesque dignissim enim. Congue mauris rhoncus aenean vel elit scelerisque mauris pellentesque. Commodo odio aenean sed adipiscing diam donec adipiscing tristique risus.
`}
        className={styles.notebook}
      />
      <IDE className={styles.ide} />
    </div>
  )
}

export default Lesson
