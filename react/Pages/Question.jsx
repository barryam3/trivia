import { Component } from 'react';
import React from 'react';
import { withRouter } from 'react-router';

class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showing: 'none'
        }
        this.goToNext = this.goToNext.bind(this);

    }

    goToNext() {
        // mark the question as asked once we reveal it
        if (this.state.showing == 'none') {
            this.props.services.games.askQuestion(this.props.params.gameUID, this.props.location.query.q);
        }
        // update display state
        if (this.state.showing != 'answer') {
            this.setState((prevState) => {
                if (this.state.showing == 'none') {
                    prevState.showing = 'question';
                } else if (this.state.showing == 'question') {
                    prevState.showing = 'answer';
                }
                return prevState;
            });
        } else {
            window.location = 'board'; // go back to board on final click
        }
    }

    render() {
        if (this.props.board.length > 0) {
            var qid = this.props.location.query.q;
            var q_per_c = this.props.board[0].questions.length;
            var c = Math.floor(qid/q_per_c); // category
            var v  = qid % q_per_c; // value - 1
            var category = this.props.board[c].title;
            var question = this.props.board[c].questions[v].question;
            var answer = this.props.board[c].questions[v].answer;
            var dd = this.props.board[c].questions[v].dailydouble;
        }

        return (
            (this.props.board.length > 0) ? (
            <main>
            	<div className='qheader'>{category} -- {v}</div>
            	<div className='qtext'>
                    { (this.state.showing=='question') && <div>{question}</div> }
                    { (this.state.showing=='answer') && <div>{answer}</div> }
                </div>
                <button id='nextbutton' onClick={this.goToNext}>Next</button>
            </main>
            ) : (<main></main>)
        )
    }
}

export default withRouter(Question);