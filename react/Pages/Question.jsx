import { Component } from 'react';
import React from 'react';
import { withRouter } from 'react-router';

class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {
        	question : "Why did the chicken cross the road?",
        	answer : "To get to the other side."

        }
    }

    render() {
        return (
            <main>
            	<h1 style={{color: 'white'}}>Question {this.props.location.query.q}</h1>
            	<div className='qtext'>
                	<span>{this.state.question}</span>
                </div>
            </main>
        )
    }
}

export default withRouter(Question);