import { Component } from 'react';
import React from 'react';
import { withRouter } from 'react-router';

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories : [
                "The Adventures of Zedidiah",
                "Lions and Tigers and SARS, Oh My!",
                "Island Countries",
                "Unusual Sports",
                "The Rise of Donald Trump",
                "Songs from the Ten Provinces"
            ],
            rows : [
                ["1", "1", "", "1", "1", "1"],
                ["2", "2", "2", "", "2", ""],
                ["3", "", "3", "", "3", ""],
                ["4", "", "", "", "4", "4"],
                ["5", "", "5", "", "5", ""],
                ["6", "", "", "6", "", ""]
            ],
            width : 6
        }
    }

    render() {
        return (
            <main>
                <table className='board'>
                    <tbody>
                    <tr className='categories'>
                        {
                        this.state.categories.map((category, key) => (
                            <td key={key} className='category'>
                                <div className='ctitle'><span>{category}</span></div>
                            </td>
                            )
                        )
                        }
                    </tr>
                    {
                    this.state.rows.map((row, rowkey) => (
                        <tr key={rowkey} className='questionrow'>
                            {
                            row.map((value, qkey) => (
                                <td key={qkey} className='question'>
                                    <span className='qvalue'>
                                        <a href={
                                            '/question?q='+(rowkey*this.state.width+qkey)
                                        }>
                                            {value}
                                        </a>
                                    </span>
                                </td>
                                )
                            )
                            }
                        </tr>
                        )
                    )
                    }
                    </tbody>
                </table>
             </main>
        )
    }
}

export default withRouter(Board);