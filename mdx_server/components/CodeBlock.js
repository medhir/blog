// src/components/CodeBlock.js
import React from 'react'
import Highlight, {defaultProps} from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/dracula'
import {LiveProvider, LiveEditor, LiveError, LivePreview} from 'react-live'
import dynamic from 'next/dynamic'
const CodeMirror = dynamic(import('./CodeMirror'), {ssr: false})

export default ({children, className, live}) => {
  const language = className.replace(/language-/, '')
  if (live) {
    return (
      <div style={{marginTop: '40px'}}>
        <LiveProvider code={children}>
          {/* <LiveEditor theme={theme}/> */}
          <CodeMirror value={children} />
          <LivePreview />
          <LiveError />
        </LiveProvider>
      </div>
    )
  }
  return (
    <Highlight {...defaultProps} code={children} language={language} theme={theme}>
      {({className, style, tokens, getLineProps, getTokenProps}) => (
        <pre className={className} style={{...style, padding: '20px'}}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({line, key: i})}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({token, key})} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}