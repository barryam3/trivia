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
                },
                screen: '',
                shown: 0
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
        if (this.props.location.query.master != 'true') {
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
            window.location = 'question?q=final&master='+this.props.location.query.master;
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
                        shown: this.state.game.shown
	                })}
                </div>
            	<Scores contestants={this.state.game.contestants}
                    services={this.props.services}
                    uid = {this.props.params.gameUID}
                    master = {this.props.location.query.master}
                    />
            </div>
        );
    }
};

Game.propTypes = {
    children : PropTypes.any.isRequired
};

export default withRouter(Game);
