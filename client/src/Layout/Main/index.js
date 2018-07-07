import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Editor from '../../Components/Editor';
import Photos from '../../Components/Gallery';
import Blog from '../../Components/Blog';
import Login from '../../Auth/Login';

import './Main.css'

class Main extends Component {
  render () {
    const md = 
`# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6`;

    const editor = <Editor markdown={ md } />;

    return (
      <main>
        <Route path="/editor"
               render={ () => editor }
               />
        <Route path="/blog" component={ Blog } />
        <Route path="/edit" component={ Login } />
        <Route path="/photos" component={ Photos } />
      </main>
      )
  }
}

export default Main;