import { Component } from 'react';
import React from 'react';
import { withRouter } from 'react-router';

class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shown: 0,
        }
        this.goToNext = this.goToNext.bind(this);

    }

    componentWillReceiveProps(nextProps) {
        if (this.props.location.query.q == 'final') {
            this.setState({ shown: -1});
        }
        if (this.props.shown >= 0) {
            this.setState({ shown: this.props.shown});
        }
    }

    componentWillMount() {
        if (this.props.master) {
            var str = 'question?q=' + this.props.location.query.q;
            this.props.services.games.updateScreen(this.props.params.gameUID, str);
        }
        if (this.props.shown) {
            this.setState({ shown: this.props.shown});
        }
    }

    // only called by master
    goToNext() {
        // mark the question as asked once we reveal it
        if (this.state.shown == '0' && this.props.location.query.q != 'final') {
            this.props.services.games.askQuestion(this.props.params.gameUID, this.props.location.query.q);
        }
        // update display state
        if (this.state.shown < 2) {
            this.props.services.games.updateShown(this.props.params.gameUID, this.state.shown+1);
            this.setState((prevState) => {
                prevState.shown = this.state.shown + 1;
            });
        // switch page on final click
        } else if (this.props.location.query.q == 'final') {
            window.location = 'gameover?master='+this.props.master;
        } else {
            window.location = 'board?master='+this.props.master;
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

        var shownText = [
            'Show Question',
            'Show Answer',
            (this.props.final.loaded ? 'Finish Game' : 'Return to Board')
        ]

        return (
            (this.props.board.length > 0 || this.props.final.loaded) ? (
            <main>
                <span>{this.state.shown}</span>
                {
                    (this.state.shown == -1) ? (
                        <div className='finalheader'>Final Jeopardy</div>
                    ) : (
                        <div>
                            <div className='qheader'>{category} {this.props.location.query.q != 'final' ? '-- '+(v+1) : ''}</div>
                            <div className='qtext'>
                                { (this.state.shown >= (this.props.master ? 0 : 1)) && 
                                    <div style={{paddingBottom : '15px'}}>{question}</div>
                                }
                                { (this.state.shown >= (this.props.master ? 1 : 2)) && 
                                    <div>{answer}</div>
                                }
                            </div>
                        </div>
                    )
                }
                {
                    this.props.master &&
                    <button id='nextbutton' onClick={this.goToNext}>{
                        this.state.shown < 0 ? 'Show Category' : shownText[this.state.shown]
                    }</button>
                }
            </main>
            ) : (<main></main>)
        )
    }
}

export default withRouter(Question);