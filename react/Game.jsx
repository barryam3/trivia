import { Component } from 'react';
import React from 'react';
import { withRouter } from 'react-router';
import { PropTypes } from 'prop-types';

import Scores from './Elements/Scores.jsx'

class Game extends Component {
    constructor(props){
        super(props);
        this.state = {
            game : {
                uid: '',
                round: '',
                contestants: [],
                single: [],
                double: [],
                final: {
                    category: '',
                    question: '',
                    answer: ''
                }
            }, // all of the state
            board : [], // single vs double jeopardy
            question : {
                    category: '',
                    question: '',
                    answer: '',
                    loaded: false
                } // for final jeopardy
        };
    }

    componentWillMount() {
        this.loadGame(this.props.params.gameUID);
    }

    // get game state from the db
    loadGame(uid) {
        this.props.services.games.getGame(uid)
            .then((res) => {
                this.setState((prevState) => {
                    prevState.game = res.content;
                    if (res.content.round == 'single') {
                        prevState.board = res.content.single;
                    }
                    if (res.content.round == 'double') {
                        prevState.board = res.content.double;
                    }
                    if (res.content.round == 'final') {
                        prevState.question = res.content.final;
                    }
                    return prevState;
                });
            });
    }

    render(){
        if (this.state.question.loaded && window.location.pathname.endsWith('board')) {
            window.location = 'question?q=final';
        }
        return (
            <div id='game'>
            	<div id='game-content'>
	                {
                        React.cloneElement(this.props.children, {
	                    services : this.props.services,
                        board : this.state.board,
                        final : this.state.question,
                        round: this.state.round
	                })}
                </div>
            	<Scores contestants={this.state.game.contestants}
                    services={this.props.services}
                    uid = {this.props.params.gameUID}
                    />
            </div>
        );
    }
};

Game.propTypes = {
    children : PropTypes.any.isRequired
};

export default withRouter(Game);
