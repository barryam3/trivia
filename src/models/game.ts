import type { Game } from "../interfaces/game";
import * as parseGameFiles from "../utils/parseGameFiles";

// Dollar value of the lowest-value question
// 200 for classic Jeopardy
const kDollarMultiplier = 2;

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
    contestants: parseGameFiles.parseContestantsCSV(contestants),
    single: {
      categories: parseGameFiles.parseGameCSV(singlecsv, 1),
    },
    double: {
      categories: parseGameFiles.parseGameCSV(doublecsv, 2),
    },
    final: parseGameFiles.parseFinalTXT(finaltxt),
    multiplier: kDollarMultiplier,
    logs: [],
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

export function askQuestion(
  uid: string,
  round: number,
  category: number,
  question: number
): Game {
  const game = getGame(uid);
  const board = round === 1 ? game.single.categories : game.double.categories;
  board[category].questions[question].asked = true;
  localStorage.setItem(uid, JSON.stringify(game));
  return game;
}

export function updateScore(
  uid: string,
  key: number,
  diff: number,
  round: number,
  category: number,
  question: number
): Game {
  const game = getGame(uid);
  if (key < 0 || key >= game.contestants.length) {
    throw new Error(`Invalid contestant number ${key}.`);
  }
  const contestant = game.contestants[key];
  contestant.score += diff;
  game.logs.push([contestant.name, round, category, question, diff]);
  localStorage.setItem(uid, JSON.stringify(game));
  return game;
}
