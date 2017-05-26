var express = require('express');
var router = express.Router();
var Game = require('../models/game');
var utils = require('../utils/utils');

// Create game
// POST /games
router.post('/', function(req, res) {
    var uid = req.body.uid;
    var contestants = req.body.contestants;
    var singlecsv = req.body.singlecsv;
    var doublecsv = req.body.doublecsv;
    var finaltxt = req.body.finaltxt;

    Game.addGame(uid, contestants, singlecsv, doublecsv, finaltxt, function(err, game) {
        if (err) {
            if (err.msg) {
                utils.sendErrorResponse(res, 400, err.msg);
            } else {
                utils.sendErrorResponse(res, 500,
                    'An unknown error has occurred.');
            }
        } else {
            utils.sendSuccessResponse(res, {uid:game.uid});
        }
    });
});

// Get game
// GET /games/:uid
router.get('/:uid', function(req, res) {
    var uid = req.params.uid;

    Game.getGame(uid, function(err, game) {
        if (err) {
            if (err.msg) {
                utils.sendErrorResponse(res, 404, err.msg);
            } else {
                utils.sendErrorResponse(res, 500,
                    'An unknown error has occurred.');
            }
        } else {
            utils.sendSuccessResponse(res, game);
        }
    });
});

// Ask Question
// PUT /games/:uid/questions
// body: qid
router.put('/:uid/questions', function(req, res) {
    var uid = req.params.uid;
    var qid = req.body.qid;

    Game.askQuestion(uid, qid, function(err, game) {
        if (err) {
            if (err.msg) {
                utils.sendErrorResponse(res, 404, err.msg);
            } else {
                utils.sendErrorResponse(res, 500,
                    'An unknown error has occurred.');
            }
        } else {
            utils.sendSuccessResponse(res, game);
        }
    });
});

module.exports = router;