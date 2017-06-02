import { Component } from 'react';
import React from 'react';
import { withRouter } from 'react-router';

class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category : '',
            value: '',
            question: '',
            answer: '',
            dailydouble: false,
            shown: 0,
        }
        this.goToNext = this.goToNext.bind(this);
        this.updateQuestionState = this.updateQuestionState.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.updateQuestionState(nextProps);
        if (this.props.shown != null && !nextProps.master) {
            this.setState({ shown: this.props.shown });
        }
    }

    componentWillMount() {
        if (this.props.master) {
            var str = 'question?q=' + this.props.location.query.q;
            this.props.services.games.updateScreen(this.props.params.gameUID, str);
        }
    }

    updateQuestionState(props) {
        if (props.board.length > 0 && props.location.query.q != 'final') {
            var qid = props.location.query.q;
            var q_per_c = props.board[0].questions.length;
            var c = Math.floor(qid/q_per_c); // category
            var v  = qid % q_per_c; // value - 1
            var shown = props.shown;
            if (props.board[c].questions[v].dailydouble && props.master) {
                props.services.games.updateShown(props.params.gameUID, -1);
                shown = -1;
            }
            this.setState({
                category: props.board[c].title,
                value: v+1,
                question: props.board[c].questions[v].question,
                answer: props.board[c].questions[v].answer,
                dailydouble: props.board[c].questions[v].dailydouble,
                shown: shown
            });
        } else if (props.location.query.q == 'final') {
            var shown = props.shown;
            if (props.master) {
                props.services.games.updateShown(props.params.gameUID, -1);
                shown = -1;
            }
            this.setState({
                category: props.final.category,
                question: props.final.question,
                answer: props.final.answer,
                shown: shown
            });
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
        var shownText = [
            'Show Question',
            'Show Answer',
            (this.props.final.loaded ? 'Finish Game' : 'Return to Board')
        ]

        return (
            (this.props.board.length > 0 || this.props.final.loaded) ? (
            <main>
                {
                    (this.state.shown == -1) ? (
                        <div className='finalheader'>{this.props.location.query.q == 'final' ? 'Final Jeopardy' : 'Daily Double'}</div>
                    ) : (
                        <div>
                            <div className='qheader'>{this.state.category}{this.props.location.query.q != 'final' ? ' -- $'+this.state.value : ''}</div>
                            <div className='qtext'>
                                { (this.state.shown >= (this.props.master ? 0 : 1)) && 
                                    <div style={{paddingBottom : '15px'}}>{this.state.question}</div>
                                }
                                { (this.state.shown >= (this.props.master ? 1 : 2)) && 
                                    <div>{this.state.answer}</div>
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