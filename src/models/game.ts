import type { Game } from "../interfaces/game";
import * as parseGameFiles from "../utils/parseGameFiles";

// returns 0 with probability .5
//         1 w.p. .25
//         2 w.p. .125
//         ...
//         limit with remaining probability
function randomEarlyEnd(limit: number) {
  let i = 0;
  while (Math.random() < 0.5 && i < limit) {
    i += 1;
  }
  return i;
}

function validateGame(game: Game) {
  if (game.contestants.length < 2) {
    throw new Error("Game needs to have at least two contestants");
  }
}

export function addGame(
  uid: string,
  contestants: string,
  singlecsv: string,
  doublecsv: string,
  finaltxt: string
) {
  if (uid.length === 0) {
    throw new Error("Unique identifier for game cannot be empty");
  }
  const obj: Game = {
    uid,
    round: "single",
    contestants: parseGameFiles.parseContestantsCSV(contestants),
    single: {
      categories: parseGameFiles.parseGameCSV(singlecsv, 1),
      earlyend: randomEarlyEnd(30), // TODO: actual num questions
    },
    double: {
      categories: parseGameFiles.parseGameCSV(doublecsv, 2),
      earlyend: randomEarlyEnd(30),
    },
    final: parseGameFiles.parseFinalTXT(finaltxt),
    screen: "board",
    shown: 0,
  };
  validateGame(obj);
  localStorage.setItem(uid, JSON.stringify(obj));
  return obj;
}

export function getGame(uid: string): Game {
  const game = localStorage.getItem(uid);
  if (!game) {
    throw new Error(`Game with uid ${uid} does not exist.`);
  }
  return JSON.parse(game) as Game;
}

export function askQuestion(uid: string, qid: number): Game {
  const game = getGame(uid);
  // get the game so we can figure out what round we are in
  const board =
    game.round === "single" ? game.single.categories : game.double.categories;
  const earlyend =
    game.round === "single" ? game.single.earlyend : game.double.earlyend;
  // convert qid to two indexes
  const qPerC = board[0].questions.length;
  const cNum = Math.floor(qid / qPerC); // category
  const v = qid % qPerC; // value - 1
  // count number of unasked questions
  board[cNum].questions[v].asked = true; // set this one to asked since it might not be
  const unaskedQuestions = board.reduce(
    (t1, c) => t1 + c.questions.reduce((t2, q) => t2 + (q.asked ? 0 : 1), 0),
    0
  );
  // next round if end condition reached
  if (unaskedQuestions <= earlyend) {
    game.round = game.round === "single" ? "double" : "final";
  }
  localStorage.setItem(uid, JSON.stringify(game));
  return game;
}

export function updateScore(uid: string, key: number, diff: number): Game {
  const game = getGame(uid);
  if (key < 0 || key >= game.contestants.length) {
    throw new Error(`Invalid contestant number ${key}.`);
  }
  game.contestants[key].score += diff;
  localStorage.setItem(uid, JSON.stringify(game));
  return game;
}

export function updateScreen(uid: string, screen: string): Game {
  const game = getGame(uid);
  game.screen = screen;
  game.shown = 0;
  localStorage.setItem(uid, JSON.stringify(game));
  return game;
}

export function updateShown(uid: string, shown: number): Game {
  const game = getGame(uid);
  game.shown = shown;
  localStorage.setItem(uid, JSON.stringify(game));
  return game;
}
