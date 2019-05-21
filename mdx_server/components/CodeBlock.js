// src/components/CodeBlock.js
import React from 'react'
import { LiveProvider, LiveError, LivePreview, LiveContext } from 'react-live'
import dynamic from 'next/dynamic'
const CodeMirror = dynamic(import('./CodeMirror'), {ssr: false})

const LiveCodeMirror = () => {
  return (
    <LiveContext.Consumer>
      {({ code, language, onChange }) => (
        <CodeMirror 
          value={code}
          onChange={onChange}
        />
      )}
    </LiveContext.Consumer>
  );
}


export default ({children, className, live}) => {
  const language = className.replace(/language-/, '')
  if (live) {
    return (
      <div style={{marginTop: '40px'}}>
        <LiveProvider code={children}>
          <LiveCodeMirror />
          <LivePreview />
          <LiveError />
        </LiveProvider>
      </div>
    )
  }
  return (
    // <Highlight {...defaultProps} code={children} language={language} theme={theme}>
    //   {({className, style, tokens, getLineProps, getTokenProps}) => (
    //     <pre className={className} style={{...style, padding: '20px'}}>
    //       {tokens.map((line, i) => (
    //         <div key={i} {...getLineProps({line, key: i})}>
    //           {line.map((token, key) => (
    //             <span key={key} {...getTokenProps({token, key})} />
    //           ))}
    //         </div>
    //       ))}
    //     </pre>
    //   )}
    // </Highlight>
    <CodeMirror value={children} />
  )
}