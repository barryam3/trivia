import Services from './services';
import { Component } from 'react';
import React from 'react';
import { withRouter } from 'react-router';
import { PropTypes } from 'prop-types';

class App extends Component {
    render(){
        return (
            <React.Fragment>
                {React.cloneElement(this.props.children, {
                    services : Services,
                })}
            </React.Fragment>
        );
    }
};

App.propTypes = {
    children : PropTypes.any.isRequired
};

export default withRouter(App);