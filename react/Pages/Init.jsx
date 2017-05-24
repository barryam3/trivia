import Services from '../../services';
import { Component } from 'react';
import React from 'react';
import { withRouter } from 'react-router';

class Init extends Component {
    constructor(props){
        super(props);
        this.state = {
        };
    }

    render(){
        return (
            <div id='reactRoot'>
                <div id='page-content'>
                	<h1>Initialized</h1>                    
                </div>
            </div>
        );
    }
};

export default withRouter(Init);