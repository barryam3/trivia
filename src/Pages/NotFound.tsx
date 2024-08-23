import React, { Component } from 'react';

import { RouteComponentProps, withRouter } from 'react-router-dom';

class NotFound extends Component<RouteComponentProps> {
  render() {
    return (
      <div>
        <h1>
          404{' '}
          <small>We couldn&apos;t find the route you were looking for...</small>
        </h1>
      </div>
    );
  }
}

export default withRouter(NotFound);
