export default `import { Fragment } from 'react'

export const Box = (props) => {
    return <div style={props.style}>{props.children}</div>
}

export const RedBorderedStyle = {
  'padding':'10px',
  'border': '1px solid black', 
  'background-color': 'red'
}

<Box style={RedBorderedStyle}><p>This is a random number: {Math.random()}</p></Box>
  
<Box style={{ border: '2px solid blue'}}><p>Hello</p></Box>

<Fragment><p>7 times 9 is { 7 * 9 }</p></Fragment>

# Hello, World! 💩`