// import hydrate from "next-mdx-remote/hydrate";
// import CodeBlock from "./codeBlock";
// import styles from "../blog/modules/Post/article.module.scss";

// interface MDXViewerProps {
//   source: string; // source is the source code associated with the MDX component generated from the raw markdown
// }

// /* MDX Components - These are the set of components that can be used in the markup */
// export const Components = {
//   pre: (props: any) => <div {...props} />,
//   code: (props: any) => <CodeBlock {...props} />,
// };

// const MDXViewer = ({ source }: MDXViewerProps) => {
//   // @ts-ignore: hydrate is not yet typescript-ified
//   const content = hydrate(source, Components);
//   return <>{content}</>;
// };

// export default MDXViewer;

import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

interface Props {
  mdxSource: MDXRemoteSerializeResult;
}

export default function RemoteMdxPage({ mdxSource }: Props) {
  return <MDXRemote {...mdxSource} />;
}

export async function getStaticProps() {
  // MDX text - can be from a local file, database, CMS, fetch, anywhere...
  const res = await fetch("https:...");
  const mdxText = await res.text();
  const mdxSource = await serialize(mdxText);
  return { props: { mdxSource } };
}
