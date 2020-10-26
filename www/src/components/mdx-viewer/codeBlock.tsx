import React from 'react'
import Highlight from 'prism-react-renderer'
import nightOwl from 'prism-react-renderer/themes/nightOwl'
import Prism from 'prism-react-renderer/prism'

export default ({ children, className }) => {
  const language = className.replace(/language-/, '')
  return (
    <Highlight
      Prism={Prism}
      theme={nightOwl}
      code={children}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <code>
          <pre className={className} style={{ ...style, padding: '10px' }}>
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
        </code>
      )}
    </Highlight>
  )
}
