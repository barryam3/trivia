import React from "react";

import { useLocation, useNavigate, useParams } from "react-router";

import Services from "../services";
import NotFound from "./NotFound";
import scoreServices from "../services/scoreServices";
import { useEventCallback } from "usehooks-ts";
import {
  SynchronizedAudio,
  SynchronizedVideo,
} from "../Elements/SynchronizedAudioVideo";

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
const VIDEO_FILE_EXT_REGEX = /\.(mp4|mov|webm)$/;
const IMAGE_FILE_EXT_REGEX = /\.(tiff?|bmp|jpe?g|gif|png|eps|webp)$/;
function QuestionPart({
  text,
  leader,
  avRef,
  ...rest
}: {
  text: string;
  leader: boolean;
  avRef: React.RefObject<HTMLAudioElement | HTMLVideoElement>;
  [key: string]: unknown;
}) {
  let content = <>{text}</>;
  if (text.match(URL_REGEX)) {
    const pathname = new URL(text).pathname;
    const props = leader ? {muted: true} : { autoPlay: true };
    if (pathname.match(AUDIO_FILE_EXT_REGEX)) {
      content = (
        <SynchronizedAudio {...props} src={text} controls={true} ref={avRef} />
      );
    } else if (pathname.match(VIDEO_FILE_EXT_REGEX)) {
      content = (
        <SynchronizedVideo
          {...props}
          style={{ height: "50vh" }}
          src={text}
          controls={true}
          ref={avRef as React.RefObject<HTMLVideoElement>}
        />
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
  isDD?: boolean;
  isFJ?: boolean;
}

function useQuestionParams() {
  const params = useParams<"round" | "category" | "question" | "stage">();
  return {
    round: Number(params.round),
    category: Number(params.category),
    question: Number(params.question),
    stage: Number(params.stage ?? 0),
  };
}

function useQuestion(): ProcessedQuestion | null {
  const game = Services.games.useGame();
  const round = Services.games.useRound();
  const params = useQuestionParams();
  const board = round?.categories ?? [];
  if (board.length > 0) {
    const category = board[params.category];
    const question = category.questions[params.question];
    return {
      category: category.title,
      value: params.question + 1,
      question: splitOnURLs(question.question),
      answer: question.answer,
      isDD: question.dailydouble,
    };
  }
  if (params.round === 3) {
    const final = game.final;
    if (!final) {
      throw new Error("Final Jeopardy not available");
    }
    return {
      category: final.category,
      question: splitOnURLs(final.question),
      answer: final.answer,
      isFJ: true,
    };
  }
  return null;
}

function hasAudioOrVideo(question: ProcessedQuestion) {
  return question.question.some((text) => {
    if (!text.match(URL_REGEX)) return false;
    const url = new URL(text);
    return (
      url.pathname.match(AUDIO_FILE_EXT_REGEX) ||
      url.pathname.match(VIDEO_FILE_EXT_REGEX)
    );
  });
}

function useAllAsked() {
  const round = Services.games.useRound();
  return round?.categories.every((c) => c.questions.every((q) => q.asked));
}

const Question: React.FC = () => {
  const question = useQuestion();
  const params = useQuestionParams();
  const game = Services.games.useGame();
  const allAsked = useAllAsked();
  const leader = Services.games.useLeader();
  const navigate = useNavigate();
  const { search } = useLocation();
  const multiplier = Services.games.useMultiplier();
  const category = Services.games.useCategory();
  if (!question) {
    return <NotFound />;
  }

  const stage = params.stage;
  const isDDorFJ = question.isDD || question.isFJ;

  const goToNext = () => {
    if (!question.isFJ) {
      Services.games.askQuestion(
        game.uid,
        params.round,
        params.category,
        params.question
      );
    }
    if (stage >= question.question.length + 1 + (isDDorFJ ? 1 : 0)) {
      const isLastQuestionOfGame =
        question.isFJ ||
        (allAsked && params.round === 2) ||
        (allAsked && params.round === 1 && game.double.categories.length === 0);
      if (isLastQuestionOfGame) {
        // To Game Over page.
        navigate({ pathname: "../../../gameover", search });
      } else if (
        allAsked &&
        params.round === 1 &&
        game.double.categories.length > 0
      ) {
        // To Double Jeopardy.
        navigate({ pathname: "../../../2/-1", search });
      } else if (
        allAsked &&
        game.final &&
        (params.round === 2 ||
          (params.round === 1 && game.double.categories.length === 0))
      ) {
        // To Final Jeopardy.
        navigate({ pathname: "../../../3/1/1", search });
      } else if (game.disableBoard) {
        // To next question.
        const nextQuestion = params.question + 1;
        if (nextQuestion < (category?.questions.length ?? 0)) {
          // To next question in category.
          navigate({
            pathname: `../../../${params.round}/${params.category}/${nextQuestion}`,
            search,
          });
        } else {
          // To next category.
          navigate({
            pathname: `../../../${params.round}/${params.category + 1}`,
            search,
          });
        }
      } else {
        // Back to Board.
        navigate({ pathname: "../..", search });
      }
    } else {
      // To next stage.
      navigate({
        pathname: `../${params.question}/${stage + 1}`,
        search,
      });
    }
  };

  const stageText = () => {
    if (stage === 0 && isDDorFJ) {
      return "Show Category";
    }
    if (stage + (isDDorFJ ? -1 : 0) < question.question.length) {
      return "Show Question";
    }
    if (stage + (isDDorFJ ? -1 : 0) === question.question.length) {
      return "Show Answer";
    }
    if (question.isFJ) {
      return "Finish Game";
    }
    return "Return to Board";
  };

  const onRightAnswer = useEventCallback(() => {
    // If answer is not yet shown.
    if (stage < question.question.length + 1 + (isDDorFJ ? 1 : 0)) {
      // Show answer.
      navigate({
        pathname: `../${params.question}/${
          question.question.length + 1 + (isDDorFJ ? 1 : 0)
        }`,
        search,
      });
    }
  });

  React.useEffect(() => {
    return scoreServices.onRightAnswer(onRightAnswer);
  }, [onRightAnswer]);

  const onKeyDown = useEventCallback((e: KeyboardEvent) => {
    if (e.key === " ") {
      // If the spacebar is pressed while the Next button is focused, let the button's
      // default click behavior handle it to avoid calling goToNext twice.
      if (
        e.target instanceof HTMLElement &&
        e.target.closest?.("#nextbutton")
      ) {
        return;
      }
      goToNext();
    }
    if (e.key === "Backspace") {
      navigate(-1);
    }
  });

  React.useEffect(() => {
    if (!leader) return;
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown, leader]);

  // Ref to bind to audio or video tag. We assume at most one audio or video tag per question.
  const avRef = React.useRef<HTMLAudioElement | HTMLVideoElement>(null);
  const stopPlaying = React.useCallback(() => avRef.current?.pause(), []);
  // Stop playing audio or video when a contestant buzzes in.
  React.useEffect(() => {
    if (game.buzzedInContestant != null) {
      stopPlaying();
    }
  }, [game.buzzedInContestant, stopPlaying]);

  return (
    <div id="question">
      {isDDorFJ && stage === 0 ? (
        <div className="finalheader">
          {question.isFJ ? "Final Jeopardy" : "Daily Double"}
        </div>
      ) : (
        <div>
          <div className="qheader">
            {question.category}
            {!question.isFJ ? (
              <span>
                {" "}
                —{" "}
                <span className="qvalue">
                  {game.unit}
                  {(question.value ?? 0) * multiplier}
                </span>
              </span>
            ) : (
              ""
            )}
          </div>
          <div className="qtext">
            <React.Fragment>
              {question.question.map((q, i) => (
                <QuestionPart
                  key={q}
                  style={{
                    paddingBottom: "15px",
                    visibility:
                      stage + (leader ? 1 : 0) + (isDDorFJ ? -1 : 0) > i
                        ? "visible"
                        : "hidden",
                  }}
                  className={
                    stage + (isDDorFJ ? -1 : 0) > i ? "" : "not-shown-yet"
                  }
                  text={q}
                  leader={leader}
                  avRef={avRef}
                />
              ))}
              <div
                style={{
                  visibility:
                    stage + (leader ? 1 : 0) + (isDDorFJ ? -1 : 0) >
                    question.question.length
                      ? "visible"
                      : "hidden",
                }}
                className={
                  stage + (isDDorFJ ? -1 : 0) > question.question.length
                    ? ""
                    : "not-shown-yet"
                }
              >
                {question.answer}
              </div>
            </React.Fragment>
          </div>
        </div>
      )}
      {leader && (
        <>
          {question.isFJ && !hasAudioOrVideo && (
            <audio
              src="https://www.televisiontunes.com/uploads/audio/Jeopardy%20-%201997%20-%20Think%20Music.mp3"
              controls={true}
            />
          )}
          {question.isDD && (
            <audio
              src="https://www.televisiontunes.com/uploads/audio/Jeopardy%20-%20Daily%20Double%20Sound%20Effect.mp3"
              controls={true}
              autoPlay={true}
            />
          )}
          <button id="nextbutton" onClick={goToNext} type="button">
            {stage < 0 ? "Show Category" : stageText()}
          </button>
        </>
      )}
    </div>
  );
};

export default Question;
