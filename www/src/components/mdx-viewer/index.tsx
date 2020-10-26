import hydrate from 'next-mdx-remote/hydrate'
import CodeBlock from './codeBlock'
import styles from '../blog/modules/Post/article.module.scss'

interface MDXViewerProps {
  source: string // source is the source code associated with the MDX component generated from the raw markdown
}

/* MDX Components - These are the set of components that can be used in the markup */
export const Components = {
  pre: (props) => <div {...props} />,
  code: (props) => <CodeBlock {...props} />,
}

const MDXViewer = ({ source }: MDXViewerProps) => {
  // @ts-ignore: hydrate is not yet typescript-ified
  const content = hydrate(source, Components)
  return <>{content}</>
}

export default MDXViewer
