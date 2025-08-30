import type { Game } from "../interfaces/game";
import * as parseGameFiles from "../utils/parseGameFiles";
import { CSVToArray } from "../utils/csv_to_array";

function validateGame(game: Game) {
  if (game.contestants.length < 2) {
    throw new Error("Game needs to have at least two contestants");
  }
}

export function addGame(
  uid: string,
  {
    title,
    contestants,
    singlecsv,
    doublecsv,
    finaltxt,
    teamsCSV,
    disableBoard,
    enableDynamicScores,
    flatPenalties,
    unit,
    scorekeepingWebhook,
    multiplier,
  }: {
    title: string;
    contestants: string;
    singlecsv: string;
    doublecsv: string;
    finaltxt: string;
    teamsCSV: string;
    disableBoard: boolean;
    enableDynamicScores: boolean;
    flatPenalties: boolean;
    unit: "$" | "";
    scorekeepingWebhook: string;
    multiplier: number;
  }
) {
  if (uid.length === 0) {
    throw new Error("Unique identifier for game cannot be empty");
  }
  const teams: string[] | undefined = teamsCSV
    ? CSVToArray(teamsCSV, ",")[0]
    : undefined;
  // For now only 2-team games are supported.
  const isTeams = teams?.length === 2;
  const obj: Game = {
    uid,
    title,
    contestants: parseGameFiles.parseContestantsCSV(contestants),
    single: {
      categories: singlecsv ? parseGameFiles.parseGameCSV(singlecsv, 1) : [],
    },
    double: {
      categories: doublecsv ? parseGameFiles.parseGameCSV(doublecsv, 2) : [],
    },
    final: finaltxt ? parseGameFiles.parseFinalTXT(finaltxt) : undefined,
    multiplier,
    logs: [],
    teams: isTeams ? teams : undefined,
    disableBoard,
    enableDynamicScores,
    flatPenalties,
    unit,
    scorekeepingWebhook,
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
  if (diff === 0) {
    throw new Error("Score cannot be changed by 0.");
  }
  const game = getGame(uid);
  if (key < 0 || key >= game.contestants.length) {
    throw new Error(`Invalid contestant number ${key}.`);
  }
  const contestant = game.contestants[key];
  contestant.score += diff;
  game.logs.push([contestant.name, round, category, question, diff]);
  if (game.scorekeepingWebhook) {
    // Remote scorekeeping ignores single/double Jeopardy. Instead, "round" is
    // the game ID, and category numbers continue after the previous round.
    let categoryOffset = 0;
    if (round > 1) {
      categoryOffset += game.single.categories.length;
    }
    if (round > 2) {
      categoryOffset += game.double.categories.length;
    }
    const scoreUpdate = {
      contestant: contestant.name,
      round: uid,
      category: category + categoryOffset,
      // questions are 0-indexed in the UI, but 1-indexed in the remote
      // scorekeeping
      question: question + 1,
      correct: diff > 0,
      score: diff,
    };
    const scoreUpdates = [scoreUpdate, ...(game.failedScoreUpdates ?? [])];
    game.failedScoreUpdates = [];
    fetch(game.scorekeepingWebhook, {
      redirect: "follow",
      method: "POST",
      body: JSON.stringify(scoreUpdates),
      // Don't trigger CORS preflight.
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
    }).catch((error) => {
      console.error(`Failed to update score: ${error}`);
      game.failedScoreUpdates = [...(game.failedScoreUpdates ?? []), ...scoreUpdates];
    });
  }
  localStorage.setItem(uid, JSON.stringify(game));
  return game;
}

export function setBuzz(uid: string, key: number | undefined): Game {
  const game = getGame(uid);
  game.buzzedInContestant = key;
  game.extraneousBuzzedInContestants = undefined;
  localStorage.setItem(uid, JSON.stringify(game));
  return game;
}

export function setBuzzerConnected(uid: string, connected: boolean): Game {
  const game = getGame(uid);
  game.buzzerConnected = connected;
  localStorage.setItem(uid, JSON.stringify(game));
  return game;
}

export function addExtraneousBuzz(uid: string, contestant: number): Game {
  const game = getGame(uid);
  if (game.extraneousBuzzedInContestants == null) {
    game.extraneousBuzzedInContestants = [];
  }
  game.extraneousBuzzedInContestants.push(contestant);
  localStorage.setItem(uid, JSON.stringify(game));
  return game;
}
