import styles from "../notebook.module.scss";
import articleStyles from "../../blog/modules/Post/article.module.scss";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { useMDXComponents } from "@/mdx_components";

interface PreviewProps {
  articleRef?: React.RefObject<HTMLElement>;
  hidden?: boolean;
  source: MDXRemoteSerializeResult;
  saved: Date;
  scroll: boolean;
}

const Preview = ({
  articleRef,
  hidden,
  saved,
  scroll,
  source,
}: PreviewProps) => {
  const components = useMDXComponents();
  const formattedDate = saved.toLocaleString("en-US", {
    month: "long", // long month format
    day: "numeric", // numeric day format
    year: "numeric", // numeric year format
    hour: "numeric", // numeric hour format
    minute: "numeric", // numeric minute format
    hour12: true, // use 12-hour clock (AM/PM)
  });
  return (
    <div
      className={`
      ${styles.preview} 
      ${scroll ? styles.scroll : null} 
      ${hidden ? styles.hidden : null}
      `}
    >
      {source && (
        <article
          ref={articleRef}
          className={`${articleStyles.article} ${styles.article}`}
        >
          <h1>{source.frontmatter.title as string}</h1>
          <div className={articleStyles.publishDate}>
            <p>
              <time dateTime={saved.toDateString()}>{formattedDate}</time>
            </p>
          </div>
          <MDXRemote {...source} components={components} />
        </article>
      )}
    </div>
  );
};

export default Preview;
