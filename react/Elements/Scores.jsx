import React from 'react';
import { Component } from 'react';
import { withRouter } from 'react-router';

class Scores extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contestants : [
                {
                    name: 'Alpha',
                    score: 12
                },
                {
                    name: 'Bravo',
                    score: 9
                },
                {  
                    name: 'Charlie',
                    score: -2
                }
            ]
        }
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
                                        <td>
                                            <span>{c.name}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span>{c.score}</span>
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