import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import About from 'Components/About'
import Gallery from 'Components/Gallery'
import Blog from 'Components/Blog'
import Uploader from 'Controls/Uploader'
import CurveTool from 'Components/CurveTool'
import Quit from 'Components/MedhirQuits'
import StyleGuide from 'Components/StyleGuide'

import 'Layout/Main/Main.scss'

class Main extends Component {
  render() {
    return (
      <main className="SiteMain">
        <Switch>
          <Route path="/about" component={About} />
          <Route path="/blog/edit" component={Blog} />
          <Route path="/photos" component={Gallery} />
          <Route path="/upload" component={Uploader} />
          <Route path="/curvetool" component={CurveTool} />
          <Route path="/quit" component={Quit} />
          <Route path="/style" component={StyleGuide} />
          <Redirect from="/" to="/photos" />
        </Switch>
      </main>
    )
  }
}

export default Main
