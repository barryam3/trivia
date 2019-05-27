const express = require('express');

const router = express.Router();
const Game = require('../models/game');
const utils = require('../utils/utils');

// Create game
// POST /games
router.post('/', (req, res) => {
  const { uid, contestants, singlecsv, doublecsv, finaltxt } = req.body;

  Game.addGame(
    uid,
    contestants,
    singlecsv,
    doublecsv,
    finaltxt,
    (err, game) => {
      if (err) {
        if (err.msg) {
          utils.sendErrorResponse(res, 400, err.msg);
        } else {
          utils.sendErrorResponse(res, 500, 'An unknown error has occurred.');
        }
      } else {
        utils.sendSuccessResponse(res, { uid: game.uid });
      }
    }
  );
});

// Get game
// GET /games/:uid
router.get('/:uid', (req, res) => {
  const { uid } = req.params;

  Game.getGame(uid, (err, game) => {
    if (err) {
      if (err.msg) {
        utils.sendErrorResponse(res, 404, err.msg);
      } else {
        utils.sendErrorResponse(res, 500, 'An unknown error has occurred.');
      }
    } else {
      utils.sendSuccessResponse(res, game);
    }
  });
});

// Ask Question
// PUT /games/:uid/questions
// body: qid
router.put('/:uid/questions', (req, res) => {
  const { uid } = req.params;
  const { qid } = req.body;

  Game.askQuestion(uid, qid, (err, game) => {
    if (err) {
      if (err.msg) {
        utils.sendErrorResponse(res, 404, err.msg);
      } else {
        utils.sendErrorResponse(res, 500, 'An unknown error has occurred.');
      }
    } else {
      utils.sendSuccessResponse(res, game);
    }
  });
});

// Update Scores
// PUT /games/:uid/scores
// body: key, diff
router.put('/:uid/scores', (req, res) => {
  const { uid } = req.params;
  const { key, diff } = req.body;

  Game.updateScore(uid, key, diff, (err, game) => {
    if (err) {
      if (err.msg) {
        utils.sendErrorResponse(res, 404, err.msg);
      } else {
        utils.sendErrorResponse(res, 500, 'An unknown error has occurred.');
      }
    } else {
      utils.sendSuccessResponse(res, game);
    }
  });
});

// Update Screen
// PUT /games/:uid/screen
// body: screen
router.put('/:uid/screen', (req, res) => {
  const { uid } = req.params;
  const { screen } = req.body;

  Game.updateScreen(uid, screen, (err, game) => {
    if (err) {
      if (err.msg) {
        utils.sendErrorResponse(res, 404, err.msg);
      } else {
        utils.sendErrorResponse(res, 500, 'An unknown error has occurred.');
      }
    } else {
      utils.sendSuccessResponse(res, game);
    }
  });
});

// Update Scores
// PUT /games/:uid/shown
// body: shown
router.put('/:uid/shown', (req, res) => {
  const { uid } = req.params;
  const { shown } = req.body;

  Game.updateShown(uid, shown, (err, game) => {
    if (err) {
      if (err.msg) {
        utils.sendErrorResponse(res, 404, err.msg);
      } else {
        utils.sendErrorResponse(res, 500, 'An unknown error has occurred.');
      }
    } else {
      utils.sendSuccessResponse(res, game);
    }
  });
});

module.exports = router;
