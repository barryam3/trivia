import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';

class NotFound extends Component {
  render() {
    return (
      <div className="container">
        <h1>
          404{' '}
          <small>We couldn&apos;t find the route you were looking for...</small>
        </h1>
      </div>
    );
  }
}

export default withRouter(NotFound);
