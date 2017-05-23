import Services from '../services';
import { Component } from 'react';
import React from 'react';
import { withRouter } from 'react-router';

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
                </div>
            </div>
        );
    }
};

App.propTypes = {
    children : React.PropTypes.any.isRequired
};

export default withRouter(App);