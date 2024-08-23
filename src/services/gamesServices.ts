import * as gameModel from "../models/game";

interface Response<T> {
  content: T;
}

// Wrap function so that it returns a promise which resolves with its return
// value (wrapped in an object) or rejects with any thrown error.
const promisify =
  <A extends unknown[], R>(f: (...args: A) => R) =>
  (...args: A) =>
    new Promise<Response<R>>((resolve, reject) => {
      try {
        resolve({ content: f(...args) });
      } catch (error) {
        reject(error);
      }
    });

const gamesServices = {
  addGame: promisify(gameModel.addGame),
  getGame: promisify(gameModel.getGame),
  askQuestion: promisify(gameModel.askQuestion),
  updateScore: promisify(gameModel.updateScore),
  updateScreen: promisify(gameModel.updateScreen),
  updateShown: promisify(gameModel.updateShown),
};

export default gamesServices;
