import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Gallery from '../../Components/Gallery';
import Blog from '../../Components/Blog';
import Uploader from '../../Controls/Uploader'
import Login from '../../Auth/Login';

import './Main.css'

class Main extends Component {
  render () {
    return (
      <main>
        <Route path="/blog" component={ Blog } />
        <Route path="/edit" component={ Login } />
        <Route path="/photos" component={ Gallery } />
        <Route path="/upload" component={ Uploader } />
      </main>
      )
  }
}

export default Main;