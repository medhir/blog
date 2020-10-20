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
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        </code>
      )}
    </Highlight>
  )
}
