import styles from "../notebook.module.scss";
import articleStyles from "../../blog/modules/Post/article.module.scss";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import CurveTool from "@/components/CurveTool";

interface PreviewProps {
  articleRef?: React.RefObject<HTMLElement>;
  hidden?: boolean;
  source: MDXRemoteSerializeResult
  scroll: boolean;
}

const components = {
    CurveTool
}

const Preview = ({ articleRef, hidden, scroll, source }: PreviewProps) => {
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
        {source && <MDXRemote {...source} components={components}/> }
      </article>
    </div>
  );
};

export default Preview;
