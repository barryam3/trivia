import React, { Component } from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import Services from "../services";
import { Category } from "../interfaces/game";

const URL_REGEX =
  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;
const randomString = `${Math.random()}`.slice(2);
/**
 * @param {string} str
 * @return {string[]}
 */
function splitOnURLs(str: string) {
  const ret = str
    .replace(URL_REGEX, (url) => `${randomString}${url}${randomString}`)
    .split(randomString)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return ret;
}

const AUDIO_FILE_EXT_REGEX = /\.(mp3|ogg|wav)$/;
const VIDEO_FILE_EXT_REGEX = /\.(mp4|mov)$/;
const IMAGE_FILE_EXT_REGEX = /\.(tiff?|bmp|jpe?g|gif|png|eps)$/;
function QuestionPart({
  text,
  leader,
  ...rest
}: {
  text: string;
  leader: boolean;
  [key: string]: any;
}) {
  let content = <>{text}</>;
  if (text.match(URL_REGEX)) {
    const pathname = new URL(text).pathname;
    const shouldAutoplay = leader ? {} : { autoPlay: true };
    if (pathname.match(AUDIO_FILE_EXT_REGEX)) {
      content = <audio {...shouldAutoplay} src={text} controls={true} />;
    } else if (pathname.match(VIDEO_FILE_EXT_REGEX)) {
      content = (
        <video {...shouldAutoplay} style={{ width: "100%" }} src={text} />
      );
    } else if (pathname.match(IMAGE_FILE_EXT_REGEX)) {
      // Height chosen imperically to maximize size without displacing score
      // row with one line of question text and one line of answer text.
      // TODO: Responsive media sizing.
      content = <img alt="" style={{ height: "50vh" }} src={text} />;
    }
  }
  return <div {...rest}>{content}</div>;
}

interface Params {
  gameUID: string;
}

export interface Final {
  category: string;
  question: string;
  answer: string;
  loaded: boolean;
}

interface Props extends RouteComponentProps<Params> {
  leader: boolean;
  shown: number;
  board: Category[];
  final: Final;
  multiplier: number;
}

interface State {
  category: string;
  value: number;
  question: string[];
  answer: string;
  shown: number;
}

class Question extends Component<Props, State> {
  state: State = {
    category: "",
    value: 0,
    question: [],
    answer: "",
    shown: 0,
  };

  componentWillMount() {
    const query = new URLSearchParams(this.props.location.search);
    const q = query.get("q");
    if (this.props.leader) {
      const str = `question?q=${q}`;
      Services.games.updateScreen(this.props.match.params.gameUID, str);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    this.updateQuestionState(nextProps);
    if (this.props.shown != null && !nextProps.leader) {
      this.setState({ shown: this.props.shown });
    }
  }

  updateQuestionState = (props: Props) => {
    const query = new URLSearchParams(this.props.location.search);
    const q = query.get("q");
    if (props.board.length > 0 && q !== "final") {
      const qid = Number(q);
      const qPerC = props.board[0].questions.length;
      const c = Math.floor(qid / qPerC); // category
      const v = qid % qPerC; // value - 1
      let { shown } = props;
      if (props.board[c].questions[v].dailydouble && props.leader) {
        Services.games.updateShown(props.match.params.gameUID, -1);
        shown = -1;
      }
      this.setState({
        category: props.board[c].title,
        value: v + 1,
        question: splitOnURLs(props.board[c].questions[v].question),
        answer: props.board[c].questions[v].answer,
        shown,
      });
    } else if (q === "final") {
      let { shown } = props;
      if (props.leader) {
        Services.games.updateShown(props.match.params.gameUID, -1);
        shown = -1;
      }
      this.setState({
        category: props.final.category,
        question: splitOnURLs(props.final.question),
        answer: props.final.answer,
        shown,
      });
    }
  };

  // only called by leader
  goToNext = () => {
    const query = new URLSearchParams(this.props.location.search);
    const q = query.get("q");
    // mark the question as asked once we reveal it
    if (this.state.shown === 0 && q !== "final") {
      Services.games.askQuestion(this.props.match.params.gameUID, Number(q));
    }
    // update display state
    if (this.state.shown < this.state.question.length + 1) {
      Services.games.updateShown(
        this.props.match.params.gameUID,
        this.state.shown + 1
      );
      this.setState((prevState) => ({
        shown: prevState.shown + 1,
      }));
      // switch page on final click
    } else if (q === "final") {
      window.location.assign(`gameover?leader=${this.props.leader}`);
    } else {
      window.location.assign(`board?leader=${this.props.leader}`);
    }
  };

  shownText = () => {
    if (this.state.shown < this.state.question.length) {
      return "Show Question";
    } else if (this.state.shown === this.state.question.length) {
      return "Show Answer";
    } else if (this.props.final.loaded) {
      return "Finish Game";
    }
    return "Return to Board";
  };

  render() {
    const query = new URLSearchParams(this.props.location.search);
    const q = query.get("q");

    return (
      <div id="question">
        {this.props.board.length > 0 || this.props.final.loaded ? (
          <React.Fragment>
            {this.state.shown === -1 ? (
              <div className="finalheader">
                {q === "final" ? "Final Jeopardy" : "Daily Double"}
              </div>
            ) : (
              <div>
                <div className="qheader">
                  {this.state.category}
                  {q !== "final" ? (
                    <span>
                      {" "}
                      —{" "}
                      <span className="qvalue">
                        ${this.state.value * this.props.multiplier}
                      </span>
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="qtext">
                  <React.Fragment>
                    {this.state.question
                      .filter(
                        (q, i) =>
                          this.state.shown + (this.props.leader ? 1 : 0) > i
                      )
                      .map((q, i) => (
                        <QuestionPart
                          key={i}
                          style={{ paddingBottom: "15px" }}
                          text={q}
                          leader={this.props.leader}
                        />
                      ))}
                    {this.state.shown + (this.props.leader ? 1 : 0) >
                      this.state.question.length && (
                      <div>{this.state.answer}</div>
                    )}
                  </React.Fragment>
                </div>
              </div>
            )}
            {this.props.leader && (
              <button id="nextbutton" onClick={this.goToNext} type="button">
                {this.state.shown < 0 ? "Show Category" : this.shownText()}
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
