import Services from '../services';
import { Component } from 'react';
import React from 'react';
import { withRouter } from 'react-router';

class Init extends Component {
    constructor(props){
        super(props);
        this.state = {
            uid: '',
            contestants: '',
            singlecsv: '',
            doublecsv: '',
            finaltxt: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
  }

    handleSubmit(event) {
        event.preventDefault();
        Services.games.addGame(this.state.uid, this.state.contestants, this.state.singlecsv,
            this.state.doublecsv, this.state.finaltxt);
    }

    render(){
        return (
            <form id='init' onSubmit={this.handleSubmit}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <label htmlFor='uid'>uid</label>
                            </td>
                            <td>
                                <input type='text' name='uid' value={this.state.uid} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor='contestants'>Contestant Names .csv:</label>
                            </td>
                            <td>
                                <textarea name='contestants' value={this.state.contestants} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor='singlecsv'>Single Jeopardy .csv:</label>
                            </td>
                            <td>
                                <textarea name='singlecsv' value={this.state.singlecsv} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor='doublecsv'>Double Jeopardy .csv:</label>
                            </td>
                            <td>
                                <textarea name='doublecsv' value={this.state.doublecsv} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor='finaltxt'>Final Jeopardy .txt:</label>
                            </td>
                            <td>
                                <textarea name='finaltxt' value={this.state.finaltxt} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan='2'>
                                <input type="submit" value="Submit" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        );
    }
};

export default withRouter(Init);