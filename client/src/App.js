import React, { Fragment, Component } from 'react'
import Header from './Layout/Header'
import Main from './Layout/Main'
import Footer from './Layout/Footer'
import './App.scss'

class App extends Component {
  render() {
    return (
      <Fragment>
        <Header />
        <Main />
        <Footer />
      </Fragment>
    )
  }
}

export default App
