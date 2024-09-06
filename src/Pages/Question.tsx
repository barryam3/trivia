import React, { useEffect } from "react";

import { useLocation, useParams } from "react-router-dom";

import Services from "../services";
import type { Category } from "../interfaces/game";

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

const AUDIO_FILE_EXT_REGEX = /\.(mp3|ogg|wav|oga)$/;
const VIDEO_FILE_EXT_REGEX = /\.(mp4|mov)$/;
const IMAGE_FILE_EXT_REGEX = /\.(tiff?|bmp|jpe?g|gif|png|eps)$/;
function QuestionPart({
  text,
  leader,
  ...rest
}: {
  text: string;
  leader: boolean;
  [key: string]: unknown;
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
}

interface Props {
  leader: boolean;
  shown: number;
  board: Category[];
  final: Final;
  finalLoaded: boolean;
  multiplier: number;
}

interface ProcessedQuestion {
  category: string;
  /** The question value, multiplied. The final question has no value. */
  value?: number;
  /** The question text, split on URLs. */
  question: string[];
  answer: string;
  /**
   * Daily Double and Final Jeopardy start with a splash screen and thus have
   * an additional stage.
   */
  isDDorFJ?: boolean;
}

const Question: React.FC<Props> = (props) => {
  const params = useParams<Params>();
  const location = useLocation();

  const shown = props.shown;

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const q = query.get("q");
    if (props.leader) {
      const str = `question?q=${q}`;
      Services.games.updateScreen(params.gameUID, str);
    }
  }, [props.leader, location.search, params.gameUID]);

  const processQuestion = (props: Props): ProcessedQuestion => {
    const query = new URLSearchParams(location.search);
    const q = query.get("q");
    if (props.board.length > 0 && q !== "final") {
      const qid = Number(q);
      const qPerC = props.board[0].questions.length;
      const c = Math.floor(qid / qPerC); // category
      const v = qid % qPerC; // value - 1
      return {
        category: props.board[c].title,
        value: v + 1,
        question: splitOnURLs(props.board[c].questions[v].question),
        answer: props.board[c].questions[v].answer,
        isDDorFJ: props.board[c].questions[v].dailydouble,
      };
    }
    if (q === "final") {
      return {
        category: props.final.category,
        question: splitOnURLs(props.final.question),
        answer: props.final.answer,
        isDDorFJ: true,
      };
    }
    throw new Error(`Invalid question number ${q} > ${props.board.length}.`);
  };

  const question = processQuestion(props);

  // only called by leader
  const goToNext = () => {
    const query = new URLSearchParams(location.search);
    const q = query.get("q");
    // mark the question as asked once we reveal it
    if (shown === 0 && q !== "final") {
      Services.games.askQuestion(params.gameUID, Number(q));
    }
    // update display state
    if (shown < question.question.length + 1 + (question.isDDorFJ ? 1 : 0)) {
      Services.games.updateShown(params.gameUID, shown + 1);
      // switch page on final click
    } else if (q === "final") {
      window.location.assign(`gameover?leader=${props.leader}`);
    } else {
      window.location.assign(`board?leader=${props.leader}`);
    }
  };

  const shownText = () => {
    if (shown === 0 && question.isDDorFJ) {
      return "Show Category";
    }
    if (shown + (question.isDDorFJ ? -1 : 0) < question.question.length) {
      return "Show Question";
    }
    if (shown + (question.isDDorFJ ? -1 : 0) === question.question.length) {
      return "Show Answer";
    }
    if (q === "final") {
      return "Finish Game";
    }
    return "Return to Board";
  };

  const query = new URLSearchParams(location.search);
  const q = query.get("q");

  return (
    <div id="question">
      {props.board.length > 0 || props.finalLoaded ? (
        <React.Fragment>
          {question.isDDorFJ && shown === 0 ? (
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
                      ${(question.value ?? 0) * props.multiplier}
                    </span>
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="qtext">
                <React.Fragment>
                  {question.question
                    .filter(
                      (q, i) =>
                        shown +
                          (props.leader ? 1 : 0) +
                          (question.isDDorFJ ? -1 : 0) >
                        i
                    )
                    .map((q, i) => (
                      <QuestionPart
                        key={q}
                        style={{ paddingBottom: "15px" }}
                        text={q}
                        leader={props.leader}
                      />
                    ))}
                  {shown +
                    (props.leader ? 1 : 0) +
                    (question.isDDorFJ ? -1 : 0) >
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

export default Question;
