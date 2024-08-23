import React from "react";

import { withRouter } from "react-router-dom";

const NotFound: React.FC = () => (
  <div>
    <h1>
      404 <small>We couldn&apos;t find the route you were looking for...</small>
    </h1>
  </div>
);

export default withRouter(NotFound);
