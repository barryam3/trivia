import { Component } from 'react';
import React from 'react';
import { withRouter } from 'react-router';

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
            var q_per_c = this.props.board[0].questions.length;
        }

        return (
            (this.props.board.length > 0) ? (
            <main>
                <table className='board'>
                    <tbody>
                        <tr>
                        {
                        this.props.board.map((category, ckey) => (
                            <td key={ckey} className='boardcell ctitle'>
                                <span>
                                    {category.title}
                                </span>
                            </td>
                        ))
                        }
                        </tr>
                        <tr>
                        {
                        this.props.board.map((category, ckey) => (
                            <td key={ckey}>
                                <table className='equalTable'>
                                    <tbody>
                                    {
                                    category.questions.map((question, qkey) => (
                                        <tr key={qkey}>
                                            <td className='boardcell qvalue'>
                                                <span>
                                                {
                                                    !question.asked && (
                                                        this.props.master ? (
                                                            <a href={
                                                                'question?q='+(ckey*q_per_c+qkey)+'&master='+this.props.master
                                                            }>
                                                                {qkey+1}
                                                            </a>
                                                        ) : (
                                                            <span>
                                                                {qkey+1}
                                                            </span>
                                                        )
                                                    )
                                                }
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </td>
                        ))}
                        </tr>
                    </tbody>
                </table>
            </main>
        ) : (<main></main>)
        );
    }
}

export default withRouter(Board);