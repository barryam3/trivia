import { Component } from 'react';
import React from 'react';
import { withRouter } from 'react-router';

class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showing: 'none',
            showed_final: false
        }
        this.goToNext = this.goToNext.bind(this);

    }

    componentWillReceiveProps(nextProps) {
        if (this.props.location.query.q == 'final' && !this.state.showed_final) {
            this.setState({ showing: 'final', showed_final: true });
        }
    }

    goToNext() {
        // mark the question as asked once we reveal it
        if (this.state.showing == 'none' && this.props.location.query.q != 'final') {
            this.props.services.games.askQuestion(this.props.params.gameUID, this.props.location.query.q);
        }
        // update display state
        if (this.state.showing != 'answer') {
            this.setState((prevState) => {
                if (this.state.showing == 'final') {
                    prevState.showing = 'none';
                }
                else if (this.state.showing == 'none') {
                    prevState.showing = 'question';
                } else if (this.state.showing == 'question') {
                    prevState.showing = 'answer';
                }
                return prevState;
            });
        // switch page on final click
        } else if (this.props.location.query.q == 'final') {
            window.location = 'gameover';
        } else {
            window.location = 'board';
        }
    }

    render() {
        if (this.props.board.length > 0 && this.props.location.query.q != 'final') {
            var qid = this.props.location.query.q;
            var q_per_c = this.props.board[0].questions.length;
            var c = Math.floor(qid/q_per_c); // category
            var v  = qid % q_per_c; // value - 1
            var category = this.props.board[c].title;
            var question = this.props.board[c].questions[v].question;
            var answer = this.props.board[c].questions[v].answer;
            var dd = this.props.board[c].questions[v].dailydouble;
        } else if (this.props.location.query.q == 'final') {
            var category = this.props.final.category;
            var question = this.props.final.question;
            var answer = this.props.final.answer;
        }

        return (
            (this.props.board.length > 0 || this.props.final.loaded) ? (
            <main>
                {
                    (this.state.showing == 'final') ? (
                        <div className='finalheader'>Final Jeopardy</div>
                    ) : (
                        <div>
                            <div className='qheader'>{category} {this.props.location.query.q != 'final' ? '-- '+(v+1) : ''}</div>
                            <div className='qtext'>
                                { (this.state.showing=='question') && <div>{question}</div> }
                                { (this.state.showing=='answer') && <div>{answer}</div> }
                            </div>
                        </div>
                    )
                }
                <button id='nextbutton' onClick={this.goToNext}>Next</button>
            </main>
            ) : (<main></main>)
        )
    }
}

export default withRouter(Question);