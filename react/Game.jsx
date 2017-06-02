import { Component } from 'react';
import React from 'react';
import { withRouter } from 'react-router';
import { PropTypes } from 'prop-types';

import Scores from './Elements/Scores.jsx'

// Dollar value of the lowest-value question
// 200 for classic Jeopardy
const kDollarMultiplier = 1;

class Game extends Component {
    constructor(props){
        super(props);
        this.state = {
            game : {
                uid: '',
                round: '',
                contestants: [],
                single: {
                    categories: [],
                    earlyend: 0
                },
                double: {
                    categories: [],
                    earlyend: 0
                },
                final: {
                    category: '',
                    question: '',
                    answer: ''
                },
                screen: '',
                shown: null
            }, // all of the state
            board : [], // single vs double jeopardy
            question : {
                    category: '',
                    question: '',
                    answer: '',
                    loaded: false
                }, // for final jeopardy
            lastScreen : ''
        };
        this.tryUntil = this.tryUntil.bind(this);
        this.checkForUpdates = this.checkForUpdates.bind(this);
    }

    // repeatedly try function f every ddt msec for dt msec
    tryUntil(f, dt, ddt) {
        f();
        if (dt > 0) {
            setTimeout(function() { tryUntil(f, dt-ddt, ddt); }, ddt);
        }
    }

    // for slave: check for updates to screen state to see if page must be reloaded
    checkForUpdates() {
        this.props.services.games.getGame(this.props.params.gameUID)
            .then((res) => {
                if (!window.location.href.endsWith(res.content.screen)) {
                    window.location = res.content.screen;
                }
                this.setState({ game: res.content });
            });
    }

    componentWillMount() {
        this.loadGame(this.props.params.gameUID);
        if (this.props.location.query.master != 'true' && !window.location.pathname.includes('gameover')) {
            this.tryUntil(this.checkForUpdates, Infinity, 50);
        }
    }

    // get game state from the db
    loadGame(uid) {
        this.props.services.games.getGame(uid)
            .then((res) => {
                this.setState((prevState) => {
                    prevState.game = res.content;
                    if (res.content.round == 'single') {
                        prevState.board = res.content.single.categories;
                    }
                    if (res.content.round == 'double') {
                        prevState.board = res.content.double.categories;
                    }
                    if (res.content.round == 'final') {
                        prevState.question = res.content.final;
                        prevState.question.loaded = true;
                    }
                    return prevState;
                });
            });
    }

    render() {
        if (this.state.question.loaded && window.location.pathname.endsWith('board')) {
            window.location = 'question?q=final&master='+this.props.location.query.master;
        }

        if (this.props.location.query.q != undefined && this.state.board.length > 0) {
            var qid = this.props.location.query.q;
            var q_per_c = this.state.board[0].questions.length;
            var value = (qid % q_per_c) + 1; // value
        } else {
            var value = null;
        }

        return (
            <div id='game'>
            	<div id='game-content'>
	                {
                        React.cloneElement(this.props.children, {
	                    services : this.props.services,
                        board : this.state.board,
                        final : this.state.question,
                        round: this.state.round,
                        master: this.props.location.query.master,
                        shown: this.state.game.shown,
                        multiplier: (this.state.round == 'double' ? 2 : 1) * kDollarMultiplier,
                        contestants: this.state.game.contestants
	                })}
                </div>
            	<Scores contestants={this.state.game.contestants}
                    services={this.props.services}
                    uid = {this.props.params.gameUID}
                    master = {this.props.location.query.master}
                    multiplier = {(this.state.round == 'double' ? 2 : 1) * kDollarMultiplier}
                    value = {value}
                    />
            </div>
        );
    }
};

Game.propTypes = {
    children : PropTypes.any.isRequired
};

export default withRouter(Game);
