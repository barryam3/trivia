import Services from '../services';
import { Component } from 'react';
import React from 'react';
import { withRouter } from 'react-router';

import Scores from './Elements/Scores.jsx'

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
        };
    }

    render(){
        return (
            <div id='reactRoot'>
                <div id='page-content'>
                    {React.cloneElement(this.props.children, {
                        services : Services,
                    })}
                <Scores />
                </div>
            </div>
        );
    }
};

App.propTypes = {
    children : React.PropTypes.any.isRequired
};

export default withRouter(App);