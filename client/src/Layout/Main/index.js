import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import About from '../../Components/About'
import Gallery from '../../Components/Gallery'
import Blog from '../../Components/Blog'
import Uploader from '../../Controls/Uploader'
import CodeEditor from '../../Components/CodeEditor';
import './Main.css'

const mdx = `# Hello, World! 
![An Image](https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100)
<Greeting name="Medhir" />`

class Main extends Component {
  render () {
    return (
      <main>
        <Switch>
          <Route path="/about" component={ About } />
          <Route path="/blog/edit" component={ Blog } />
          <Route path="/code" component={ () => <CodeEditor mdx={ mdx } /> } />
          <Route path="/photos" component={ Gallery } />
          <Route path="/upload" component={ Uploader } />
          <Redirect from="/" to="/photos" />
        </Switch>
      </main>
      )
  }
}

export default Main;