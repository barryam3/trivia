import { Component } from 'react';
import React from 'react';
import { withRouter } from 'react-router';

import Services from '../services';

class GameOver extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentWillMount() {
        if (this.props.master) {
            Services.games.updateScreen(this.props.params.gameUID, 'gameover');
            window.location = 'gameover';
        }
    }

    render() {
        return (
            <main>
                <div className='finalheader'>Game Over</div>
                {this.props.contestants.length > 0 &&
                    <div className='winner'>{this.props.contestants.reduce((prev, current) => (prev.score > current.score) ? prev : current).name} wins!</div>
                }

            </main>
        )
    }
}

export default withRouter(GameOver);