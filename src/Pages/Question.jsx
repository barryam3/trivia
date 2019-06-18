import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';

import Services from '../services';

const URL_REGEX = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;
const randomString = `${Math.random()}`.slice(2);
/**
 * @param {string} str
 * @return {string[]}
 */
function splitOnURLs(str) {
  const ret = str
    .replace(URL_REGEX, url => `${randomString}${url}${randomString}`)
    .split(randomString)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  console.log(ret);
  return ret;
}

const AUDIO_FILE_EXT_REGEX = /(.mp3|.ogg|.wav)$/;
const VIDEO_FILE_EXT_REGEX = /(.mp4|.mov)$/;
function QuestionPart({ text, master, ...rest }) {
  let content = text;
  if (text.match(URL_REGEX)) {
    const shouldAutoplay = master ? {} : { autoPlay: 'autoplay' };
    if (text.match(AUDIO_FILE_EXT_REGEX)) {
      content = <audio {...shouldAutoplay} src={text} />;
    } else if (text.match(VIDEO_FILE_EXT_REGEX)) {
      content = (
        <video {...shouldAutoplay} style={{ width: '100%' }} src={text} />
      );
    }
  }
  return <div {...rest}>{content}</div>;
}

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
        Services.games.updateShown(props.match.params.gameUID, -1);
        shown = -1;
      }
      this.setState({
        category: props.board[c].title,
        value: v + 1,
        question: splitOnURLs(props.board[c].questions[v].question),
        answer: props.board[c].questions[v].answer,
        shown
      });
    } else if (q === 'final') {
      let { shown } = props;
      if (props.master) {
        Services.games.updateShown(props.match.params.gameUID, -1);
        shown = -1;
      }
      this.setState({
        category: props.final.category,
        question: splitOnURLs(props.final.question),
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
    if (this.state.shown < this.state.question.length + 1) {
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

  shownText = () => {
    if (this.state.shown < this.state.question.length) {
      return 'Show Question';
    } else if (this.state.shown === this.state.question.length) {
      return 'Show Answer';
    } else if (this.props.final.loaded) {
      return 'Finish Game';
    }
    return 'Return to Board';
  };

  render() {
    const query = new URLSearchParams(this.props.location.search);
    const q = query.get('q');

    return (
      <div id="question">
        {this.props.board.length > 0 || this.props.final.loaded ? (
          <React.Fragment>
            {this.state.shown === -1 ? (
              <div className="finalheader">
                {q === 'final' ? 'Final Jeopardy' : 'Daily Double'}
              </div>
            ) : (
              <div>
                <div className="qheader">
                  {this.state.category}
                  {q !== 'final' ? (
                    <span>
                      {' '}
                      —{' '}
                      <span className="qvalue">
                        ${this.state.value * this.props.multiplier}
                      </span>
                    </span>
                  ) : (
                    ''
                  )}
                </div>
                <div className="qtext">
                  <React.Fragment>
                    {this.state.question
                      .filter(
                        (q, i) =>
                          this.state.shown + (this.props.master ? 1 : 0) > i
                      )
                      .map((q, i) => (
                        <QuestionPart
                          key={i}
                          style={{ paddingBottom: '15px' }}
                          text={q}
                          master={this.props.master}
                        />
                      ))}
                    {this.state.shown + (this.props.master ? 1 : 0) >
                      this.state.question.length && (
                      <div>{this.state.answer}</div>
                    )}
                  </React.Fragment>
                </div>
              </div>
            )}
            {this.props.master && (
              <button id="nextbutton" onClick={this.goToNext} type="button">
                {this.state.shown < 0 ? 'Show Category' : this.shownText()}
              </button>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment />
        )}
      </div>
    );
  }
}

export default withRouter(Question);
