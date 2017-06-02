import { Component } from 'react';
import React from 'react';
import { withRouter } from 'react-router';

var range = function(start, stop) {
    var arr = []
    var i;
    for (i = 0; i < stop; i++) {
        arr.push(i);
    }
    return arr;
}

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentWillMount() {
        if (this.props.master) {
            this.props.services.games.updateScreen(this.props.params.gameUID, 'board');
        }
    }

    render() {
        if (this.props.board.length > 0) {
            var num_c = this.props.board.length;
            var q_per_c = this.props.board[0].questions.length;
        }

        return (
            (this.props.board.length > 0) ? (
            <main>
                <table id='board'>
                    <tbody style={{height:'100%'}}>
                        <tr className='crow'>
                        {
                            this.props.board.map((category, ckey) => (
                                <th key={ckey} className='boardcell ctitle'>
                                    <span>
                                        {category.title}
                                    </span>
                                </th>
                            ))
                        }
                        </tr>
                        {
                            range(0,q_per_c).map((vkey) => (
                                <tr key={vkey} className='qrow'>
                                {
                                    range(0, num_c).map((ckey) => (
                                        <td key={ckey} className='boardcell qvalue'>
                                        {
                                            !this.props.board[ckey].questions[vkey].asked && (
                                                this.props.master ? (
                                                    <a href={
                                                        'question?q='+(ckey*q_per_c+vkey)+'&master='+this.props.master
                                                    }>
                                                        ${this.props.multiplier*(vkey+1)}
                                                    </a>
                                                ) : (
                                                    <span>
                                                        ${this.props.multiplier*(vkey+1)}
                                                    </span>
                                                )
                                            )
                                        }
                                        </td>  
                                    ))
                                }
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </main>
        ) : (<main></main>)
        );
    }
}

export default withRouter(Board);