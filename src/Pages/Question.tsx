import React, { useEffect, useState } from "react";

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
  /**
   * The stage at which the question is shown. In general, 1 means question
   * has been shown and 2 means answer has been shown, but for questions with
   * media URLs there are multiple "questions" so the numbers go higher.
   */
  shown: number;
}

interface ProcessedQuestion extends State {
  category: string;
  /** The question value, multiplied. The final question has no value. */
  value?: number;
  /** The question text, split on URLs. */
  question: string[];
  answer: string;
}

const Question: React.FC<Props> = (props) => {
  const [state, setState] = useState<State>({
    shown: props.shown,
  });

  // Use this instead of props.shown or state.shown.
  const shown = Math.max(props.shown, state.shown);

  useEffect(() => {
    const query = new URLSearchParams(props.location.search);
    const q = query.get("q");
    if (props.leader) {
      const str = `question?q=${q}`;
      Services.games.updateScreen(props.match.params.gameUID, str);
    }
  }, [props.leader, props.location.search, props.match.params.gameUID]);

  const processQuestion = (props: Props): ProcessedQuestion => {
    const query = new URLSearchParams(props.location.search);
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
      return {
        category: props.board[c].title,
        value: v + 1,
        question: splitOnURLs(props.board[c].questions[v].question),
        answer: props.board[c].questions[v].answer,
        shown,
      };
    } else if (q === "final") {
      let { shown } = props;
      if (props.leader) {
        Services.games.updateShown(props.match.params.gameUID, -1);
        shown = -1;
      }
      return {
        category: props.final.category,
        question: splitOnURLs(props.final.question),
        answer: props.final.answer,
        shown,
      };
    } else {
      throw new Error(`Invalid question number ${q}.`);
    }
  };

  const question = processQuestion(props);

  // only called by leader
  const goToNext = () => {
    const query = new URLSearchParams(props.location.search);
    const q = query.get("q");
    // mark the question as asked once we reveal it
    if (shown === 0 && q !== "final") {
      Services.games.askQuestion(props.match.params.gameUID, Number(q));
    }
    // update display state
    if (shown < question.question.length + 1) {
      Services.games.updateShown(props.match.params.gameUID, shown + 1);
      setState((prevState) => ({
        shown: shown + 1,
      }));
      // switch page on final click
    } else if (q === "final") {
      window.location.assign(`gameover?leader=${props.leader}`);
    } else {
      window.location.assign(`board?leader=${props.leader}`);
    }
  };

  const shownText = () => {
    if (shown < question.question.length) {
      return "Show Question";
    } else if (shown === question.question.length) {
      return "Show Answer";
    } else if (props.final.loaded) {
      return "Finish Game";
    }
    return "Return to Board";
  };

  const query = new URLSearchParams(props.location.search);
  const q = query.get("q");

  return (
    <div id="question">
      {props.board.length > 0 || props.final.loaded ? (
        <React.Fragment>
          {shown === -1 ? (
            <div className="finalheader">
              {q === "final" ? "Final Jeopardy" : "Daily Double"}
            </div>
          ) : (
            <div>
              <div className="qheader">
                {question.category}
                {q !== "final" ? (
                  <span>
                    {" "}
                    —{" "}
                    <span className="qvalue">
                      ${question.value! * props.multiplier}
                    </span>
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="qtext">
                <React.Fragment>
                  {question.question
                    .filter((q, i) => shown + (props.leader ? 1 : 0) > i)
                    .map((q, i) => (
                      <QuestionPart
                        key={i}
                        style={{ paddingBottom: "15px" }}
                        text={q}
                        leader={props.leader}
                      />
                    ))}
                  {shown + (props.leader ? 1 : 0) >
                    question.question.length && <div>{question.answer}</div>}
                </React.Fragment>
              </div>
            </div>
          )}
          {props.leader && (
            <button id="nextbutton" onClick={goToNext} type="button">
              {shown < 0 ? "Show Category" : shownText()}
            </button>
          )}
        </React.Fragment>
      ) : (
        <React.Fragment />
      )}
    </div>
  );
};

export default withRouter(Question);
