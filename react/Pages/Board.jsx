import { Component } from 'react';
import React from 'react';

export default class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories : ["c1", "c2", "c3", "c4", "c5", "c6"],
            rows : [
                ["1", "1", "", "1", "1", "1"],
                ["2", "2", "2", "", "2", ""],
                ["3", "", "3", "", "3", ""],
                ["4", "", "", "", "4", "4"],
                ["5", "", "5", "", "5", ""],
                ["6", "", "", "6", "", ""]
            ]
        }
    }

    render() {
        return (
            <main>
                <div className='board'>
                    <div className='categories'>
                        {
                        this.state.categories.map((category, key) => (
                            <div key={key} className='category'>
                                <p className='ctitle'>{category}</p>
                            </div>
                            )
                        )
                        }
                    </div>
                    {
                    this.state.rows.map((row, key) => (
                        <div key={key} className='questionrow'>
                            {
                            row.map((value, key) => (
                                <div key={key} className='question'>
                                    <p className='qvalue'>{value}</p>
                                </div>
                                )
                            )
                            }
                        </div>
                        )
                    )
                    }
                </div>
             </main>
        )
    }
}