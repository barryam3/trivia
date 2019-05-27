import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';
import Services from '../services';

class Init extends Component {
  state = {
    uid: '',
    contestants: '',
    singlecsv: '',
    doublecsv: '',
    finaltxt: ''
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    Services.games.addGame(
      this.state.uid,
      this.state.contestants,
      this.state.singlecsv,
      this.state.doublecsv,
      this.state.finaltxt
    );
  };

  render() {
    return (
      <form id="init" onSubmit={this.handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td>
                <label htmlFor="uid">uid</label>
              </td>
              <td>
                <input
                  id="uid"
                  type="text"
                  name="uid"
                  value={this.state.uid}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="contestants">Contestant Names .csv:</label>
              </td>
              <td>
                <textarea
                  id="contestants"
                  name="contestants"
                  value={this.state.contestants}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="singlecsv">Single Jeopardy .csv:</label>
              </td>
              <td>
                <textarea
                  id="singlecsv"
                  name="singlecsv"
                  value={this.state.singlecsv}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="doublecsv">Double Jeopardy .csv:</label>
              </td>
              <td>
                <textarea
                  id="doublecsv"
                  name="doublecsv"
                  value={this.state.doublecsv}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="finaltxt">Final Jeopardy .txt:</label>
              </td>
              <td>
                <textarea
                  id="finaltxt"
                  name="finaltxt"
                  value={this.state.finaltxt}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <input type="submit" value="Submit" />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    );
  }
}

export default withRouter(Init);
