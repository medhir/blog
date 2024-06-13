import styles from "../notebook.module.scss";
import articleStyles from "../../blog/modules/Post/article.module.scss";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import CurveTool from "@/components/CurveTool";
import { useMDXComponents } from "@/mdx_components";

interface PreviewProps {
  articleRef?: React.RefObject<HTMLElement>;
  hidden?: boolean;
  source: MDXRemoteSerializeResult;
  scroll: boolean;
}

const Preview = ({ articleRef, hidden, scroll, source }: PreviewProps) => {
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
        {source && <MDXRemote {...source} components={components} />}
      </article>
    </div>
  );
};

export default Preview;
