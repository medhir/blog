import styles from "../notebook.module.scss";
import articleStyles from "../../blog/modules/Post/article.module.scss";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { useMDXComponents } from "@/mdx_components";
import { PostMetadata } from "@/components/blog";

interface PreviewProps {
  articleRef?: React.RefObject<HTMLElement>;
  draft: boolean;
  hidden?: boolean;
  postMetadata: PostMetadata;
  source: MDXRemoteSerializeResult;
  scroll: boolean;
}

const Preview = ({
  articleRef,
  draft,
  postMetadata,
  hidden,
  scroll,
  source,
}: PreviewProps) => {
  const components = useMDXComponents();
  const locale = "en-US";
  const localeStringOptions: Intl.DateTimeFormatOptions = {
    month: "long", // long month format
    day: "numeric", // numeric day format
    year: "numeric", // numeric year format
    hour: "numeric", // numeric hour format
    minute: "numeric", // numeric minute format
    hour12: true, // use 12-hour clock (AM/PM)
  };
  let formattedDate;
  if (draft) {
    formattedDate = new Date(
      postMetadata.saved_on as number
    ).toLocaleTimeString(locale, localeStringOptions);
  } else {
    formattedDate = new Date(
      postMetadata.published_on as number
    ).toLocaleTimeString(locale, localeStringOptions);
  }
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
              <time dateTime={formattedDate}>{formattedDate}</time>
            </p>
          </div>
          <MDXRemote {...source} components={components} />
        </article>
      )}
    </div>
  );
};

export default Preview;
