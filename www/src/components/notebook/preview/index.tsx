import styles from "../notebook.module.scss";
import articleStyles from "../../blog/modules/Post/article.module.scss";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import CurveTool from "@/components/CurveTool";
import { useMDXComponents } from "@/mdx_components";

interface PreviewProps {
  articleRef?: React.RefObject<HTMLElement>;
  title: string;
  hidden?: boolean;
  source: MDXRemoteSerializeResult;
  scroll: boolean;
}

const Preview = ({
  articleRef,
  hidden,
  scroll,
  source,
  title,
}: PreviewProps) => {
  const components = useMDXComponents();
  return (
    <div
      className={`
      ${styles.preview} 
      ${scroll ? styles.scroll : null} 
      ${hidden ? styles.hidden : null}
      `}
    >
      <article
        ref={articleRef}
        className={`${articleStyles.article} ${styles.article}`}
      >
        <h1>{title}</h1>
        {source && <MDXRemote {...source} components={components} />}
      </article>
    </div>
  );
};

export default Preview;
