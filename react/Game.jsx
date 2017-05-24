import { Component } from 'react';
import React from 'react';
import { withRouter } from 'react-router';

import Scores from './Elements/Scores.jsx'

class Game extends Component {
    constructor(props){
        super(props);
        this.state = {
        };
    }

    render(){
        return (
            <div id='game'>
            	<div id='game-content'>
	                {React.cloneElement(this.props.children, {
	                    services : this.props.services,
	                })}
                </div>
            	<Scores />
            </div>
        );
    }
};

Game.propTypes = {
    children : React.PropTypes.any.isRequired
};

export default withRouter(Game);
