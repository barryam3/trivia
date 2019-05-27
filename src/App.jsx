import Services from './services';
import { Component } from 'react';
import React from 'react';
import { withRouter } from 'react-router';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        {React.cloneElement(this.props.children, {
          services: Services
        })}
      </React.Fragment>
    );
  }
}

export default withRouter(App);
