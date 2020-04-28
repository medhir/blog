import renderToString from 'next-mdx-remote/render-to-string'
import hydrate from './hydrate'
import { NextPageContext } from 'next'

/* MDX Components */
const components = {
  Button: ({ children, style }) => (
    <button style={{ border: '2px red solid', borderRadius: '10px', ...style }}>
      {children}
    </button>
  ),
}

export default function TestPage({ mdxSource }) {
  const content = hydrate(mdxSource, components)
  return <div className="wrapper">{content}</div>
}

export async function getServerSideProps(context: NextPageContext) {
  // mdx text - can be from a local file, database, anywhere
  const source = `
  <Button style={{ margin: '10px', padding: '20px' }}>Click Me!</Button>
  `
  const mdxSource = await renderToString(source, components)
  return { props: { mdxSource } }
}
