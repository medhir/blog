import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import About from '../../Components/About';
import Gallery from '../../Components/Gallery';
import Blog from '../../Components/Blog';
import Uploader from '../../Controls/Uploader';

import './Main.css';
import CurveTool from '../../Components/CurveTool';

class Main extends Component {
  render() {
    return (
      <main>
        <Switch>
          <Route path="/about" component={About} />
          <Route path="/blog/edit" component={Blog} />
          <Route path="/photos" component={Gallery} />
          <Route path="/upload" component={Uploader} />
          <Route path="/curve.tool" component={CurveTool} />
          <Redirect from="/" to="/photos" />
        </Switch>
      </main>
    );
  }
}

export default Main;
