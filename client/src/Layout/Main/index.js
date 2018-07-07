import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Photos from '../../Components/Gallery';
import Editor from '../../Components/Editor';
import Login from '../../Auth/Login';

import './Main.css'

const md = 
`# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6`;

const editor = <Editor markdown={ md } />;

class Main extends Component {
  render () {
    return (
      <main>
        <Route path="/blog"
               render={ () => editor }
               />
        <Route path="/edit" component={ Login } />
        {/* <Route path="/about" component={ About } /> */}
        <Route path="/photos" component={ Photos } />
      </main>
      )
  }
}

export default Main;