import React, { useEffect } from "react";

import { useLocation } from "react-router-dom";

import Services from "../services";

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

export interface Final {
  category: string;
  question: string;
  answer: string;
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

const Question: React.FC = () => {
  const game = Services.games.useGame();
  const leader = Services.games.useLeader();
  const board =
    game.round === "single" ? game.single.categories : game.double.categories;
  const final = game.final;
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const q = query.get("q");

  useEffect(() => {
    if (leader) {
      const str = `question?q=${q}`;
      Services.games.updateScreen(game.uid, str);
    }
  }, [leader, q, game.uid]);

  const processQuestion = (): ProcessedQuestion => {
    if (board.length > 0 && q !== "final") {
      const qid = Number(q);
      const qPerC = board[0].questions.length;
      const c = Math.floor(qid / qPerC); // category
      const v = qid % qPerC; // value - 1
      return {
        category: board[c].title,
        value: v + 1,
        question: splitOnURLs(board[c].questions[v].question),
        answer: board[c].questions[v].answer,
        isDDorFJ: board[c].questions[v].dailydouble,
      };
    }
    if (q === "final") {
      return {
        category: final.category,
        question: splitOnURLs(final.question),
        answer: final.answer,
        isDDorFJ: true,
      };
    }
    throw new Error(`Invalid question number ${q} > ${board.length}.`);
  };

  const question = processQuestion();
  const shown = game.shown;
  console.log(game, game.shown);

  // only called by leader
  const goToNext = () => {
    // mark the question as asked once we reveal it
    if (shown === 0 && q !== "final") {
      Services.games.askQuestion(game.uid, Number(q));
    }
    // update display state
    if (shown < question.question.length + 1 + (question.isDDorFJ ? 1 : 0)) {
      Services.games.updateShown(game.uid, shown + 1);
      // switch page on final click
    } else if (q === "final") {
      window.location.assign(`gameover?leader=${leader}`);
    } else {
      window.location.assign(`board?leader=${leader}`);
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

  const finalLoaded = game.round === "final";

  return (
    <div id="question">
      {board.length > 0 || finalLoaded ? (
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
                      ${(question.value ?? 0) * game.multiplier}
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
                          (leader ? 1 : 0) +
                          (question.isDDorFJ ? -1 : 0) >
                        i
                    )
                    .map((q, i) => (
                      <QuestionPart
                        key={q}
                        style={{ paddingBottom: "15px" }}
                        text={q}
                        leader={leader}
                      />
                    ))}
                  {shown + (leader ? 1 : 0) + (question.isDDorFJ ? -1 : 0) >
                    question.question.length && <div>{question.answer}</div>}
                </React.Fragment>
              </div>
            </div>
          )}
          {leader && (
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
