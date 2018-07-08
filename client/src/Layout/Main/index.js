import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Editor from '../../Components/Editor';
import Photos from '../../Components/Gallery';
import Blog from '../../Components/Blog';
import Login from '../../Auth/Login';

import './Main.css'

class Main extends Component {
  render () {
    return (
      <main>
        <Route path="/blog" component={ Blog } />
        <Route path="/edit" component={ Login } />
        <Route path="/photos" component={ Photos } />
      </main>
      )
  }
}

export default Main;