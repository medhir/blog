import { Component } from 'react';
import Auth0 from 'auth0-js';

class CrossOrigin extends Component {
  componentDidMount() {
    const webAuth = Auth0.WebAuth({
      domain: 'medhir.auth0.com',
      clientID: 'iQLtk7iIJDVpsGoT3daNp5lvhLM9Pfkx',
    });
    webAuth.crossOriginVerification();
  }

  render() {
    return null;
  }
}

export default CrossOrigin;
