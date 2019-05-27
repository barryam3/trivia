import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';
import FitText from '@kennethormandy/react-fittext';

import Services from '../services';

class Question extends Component {
  state = {
    category: '',
    value: '',
    question: '',
    answer: '',
    shown: 0
  };

  componentWillMount() {
    const query = new URLSearchParams(this.props.location.search);
    const q = query.get('q');
    if (this.props.master) {
      const str = `question?q=${q}`;
      Services.games.updateScreen(this.props.match.params.gameUID, str);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.updateQuestionState(nextProps);
    if (this.props.shown != null && !nextProps.master) {
      this.setState({ shown: this.props.shown });
    }
  }

  updateQuestionState = props => {
    const query = new URLSearchParams(this.props.location.search);
    const q = query.get('q');
    if (props.board.length > 0 && q !== 'final') {
      const qid = q;
      const qPerC = props.board[0].questions.length;
      const c = Math.floor(qid / qPerC); // category
      const v = qid % qPerC; // value - 1
      let { shown } = props;
      if (props.board[c].questions[v].dailydouble && props.master) {
        Services.games.updateShown(props.params.gameUID, -1);
        shown = -1;
      }
      this.setState({
        category: props.board[c].title,
        value: v + 1,
        question: props.board[c].questions[v].question,
        answer: props.board[c].questions[v].answer,
        shown
      });
    } else if (q === 'final') {
      let { shown } = props;
      if (props.master) {
        Services.games.updateShown(props.params.gameUID, -1);
        shown = -1;
      }
      this.setState({
        category: props.final.category,
        question: props.final.question,
        answer: props.final.answer,
        shown
      });
    }
  };

  // only called by master
  goToNext = () => {
    const query = new URLSearchParams(this.props.location.search);
    const q = query.get('q');
    // mark the question as asked once we reveal it
    if (this.state.shown === 0 && q !== 'final') {
      Services.games.askQuestion(this.props.match.params.gameUID, q);
    }
    // update display state
    if (this.state.shown < 2) {
      Services.games.updateShown(
        this.props.match.params.gameUID,
        this.state.shown + 1
      );
      this.setState(prevState => ({
        shown: prevState.shown + 1
      }));
      // switch page on final click
    } else if (q === 'final') {
      window.location = `gameover?master=${this.props.master}`;
    } else {
      window.location = `board?master=${this.props.master}`;
    }
  };

  render() {
    const query = new URLSearchParams(this.props.location.search);
    const q = query.get('q');
    const shownText = [
      'Show Question',
      'Show Answer',
      this.props.final.loaded ? 'Finish Game' : 'Return to Board'
    ];

    return this.props.board.length > 0 || this.props.final.loaded ? (
      <main>
        {this.state.shown === -1 ? (
          <div className="finalheader">
            {q === 'final' ? 'Final Jeopardy' : 'Daily Double'}
          </div>
        ) : (
          <div>
            <div className="qheader">
              {this.state.category}
              {q !== 'final'
                ? ` -- $${this.state.value * this.props.multiplier}`
                : ''}
            </div>
            <div className="qtext">
              <FitText maxFontSize={48}>
                <React.Fragment>
                  {this.state.shown >= (this.props.master ? 0 : 1) && (
                    <div style={{ paddingBottom: '15px' }}>
                      {this.state.question}
                    </div>
                  )}
                  {this.state.shown >= (this.props.master ? 1 : 2) && (
                    <div>{this.state.answer}</div>
                  )}
                </React.Fragment>
              </FitText>
            </div>
          </div>
        )}
        {this.props.master && (
          <button id="nextbutton" onClick={this.goToNext} type="button">
            {this.state.shown < 0
              ? 'Show Category'
              : shownText[this.state.shown]}
          </button>
        )}
      </main>
    ) : (
      <main />
    );
  }
}

export default withRouter(Question);
