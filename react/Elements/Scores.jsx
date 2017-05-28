import React from 'react';
import { Component } from 'react';
import { withRouter } from 'react-router';

class Scores extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contestants: this.props.contestants
        }
        this.updateScore = this.updateScore.bind(this);
    }

    updateScore(key, diff) {
        return () => {
            console.log(this.state);
            this.setState((prevState) => {
                prevState.contestants[key].score += diff;
                return prevState;
            });
            this.props.services.games.updateScore(this.props.uid, key, diff);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ contestants: nextProps.contestants });
    }

    render() {
        return (
            <table className='scores'>
                <tbody>
                    <tr>
                    {this.state.contestants.map((c, key) => (
                        <td key={key}>
                            <table>
                                <tbody>
                                    <tr>
                                        <td rowSpan={2}>
                                            <button className='btn-link scorebutton'
                                            onClick={this.updateScore(key, -1)}>
                                                -
                                            </button>
                                        </td>
                                        <td>
                                            <span className='scoretext'>{c.name}</span>
                                        </td>
                                        <td rowSpan={2}>
                                            <button className='btn-link scorebutton'
                                            onClick={this.updateScore(key, 1)}>
                                                +
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span className='scoretext'>{c.score}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    ))}
                    </tr>
                </tbody>
            </table>
        );
    }
};

export default withRouter(Scores);