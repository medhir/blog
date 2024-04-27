import React from "react";
import { Highlight, themes } from "prism-react-renderer";
import styles from "../blog/modules/Post/article.module.scss";

export default function CodeBlock({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}): any {
  const language = className.replace(/language-/, "");
  return (
    <Highlight
      theme={themes.nightOwl}
      code={children as string}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${className} ${styles.codeBlock}`}
          style={{ ...style, padding: "10px" }}
        >
          {tokens.map((line, i, a) =>
            i < a.length - 1 ? ( // on syntax highlighting, for some reason there is an extra line registered as a token. this is to remove that last token from the list.
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ) : null
          )}
        </pre>
      )}
    </Highlight>
  );
}
