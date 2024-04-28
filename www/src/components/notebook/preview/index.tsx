// import MDXViewer from "../../mdx-viewer";
import styles from "../notebook.module.scss";
import articleStyles from "../../blog/modules/Post/article.module.scss";

interface PreviewProps {
  articleRef?: React.RefObject<HTMLElement>;
  hidden?: boolean;
  source: string;
  scroll: boolean;
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
        {/* {source && <MDXViewer source={source} />} */}
      </article>
    </div>
  );
};

export default Preview;
