import React from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import VSDark from 'prism-react-renderer/themes/vsDark'

export default ({ children, className }) => {
  const language = className.replace(/language-/, '')
  return (
    <Highlight
      theme={VSDark}
      {...defaultProps}
      code={children}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <code>
          <pre className={className} style={{ ...style, padding: '20px' }}>
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
