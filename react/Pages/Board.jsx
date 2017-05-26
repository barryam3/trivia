import { Component } from 'react';
import React from 'react';
import { withRouter } from 'react-router';

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {

        return (
            <main>
                <table className='board'>
                    <tbody>
                        <tr>
                        {
                        this.props.board.map((category, ckey) => (
                            <td key={ckey}>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className='boardcell'>
                                                <span className='cvalue'>
                                                    {category.title}
                                                </span>
                                            </td>
                                        </tr>
                                        {
                                        category.questions.map((question, qkey) => (
                                            <tr key={qkey}>
                                                <td className='boardcell'>
                                                    <span className='qvalue'>
                                                    {
                                                        !question.asked && (
                                                            <a href={
                                                                'question?q='+(ckey+qkey*this.props.board.length)
                                                            }>
                                                                {qkey+1}
                                                            </a>
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
        );
    }
}

export default withRouter(Board);