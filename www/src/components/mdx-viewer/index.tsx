import hydrate from './hydrate'

interface MDXViewerProps {
  source: string // source is the source code associated with the MDX component generated from the raw markdown
}

/* MDX Components - These are the set of components that can be used in the markup */
export const Components = {
  Button: ({ children, style }) => (
    <button style={{ border: '2px red solid', borderRadius: '10px', ...style }}>
      {children}
    </button>
  ),
}

const MDXViewer = ({ source }: MDXViewerProps) => {
  // @ts-ignore: hydrate is not yet typescript-ified
  const content = hydrate(source, Components)
  return <>{content}</>
}

export default MDXViewer