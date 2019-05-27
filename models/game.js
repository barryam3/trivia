const mongoose = require('mongoose');
const parseGameFiles = require('../utils/parseGameFiles');

// returns 0 with probability .5
//         1 w.p. .25
//         2 w.p. .125
//         ...
//         limit with remaining probability
function randomEarlyEnd(limit) {
  let i = 0;
  while (Math.random() < 0.5 && i < limit) {
    i += 1;
  }
  return i;
}

const gameSchema = mongoose.Schema({
  uid: {
    type: String,
    required: true
  },
  round: {
    type: String,
    required: true
  },
  contestants: {
    type: [
      {
        name: String,
        score: Number
      }
    ],
    required: true
  },
  single: {
    type: {
      categories: [
        {
          title: String,
          questions: [
            {
              question: String,
              answer: String,
              asked: Boolean,
              dailydouble: Boolean
            }
          ]
        }
      ],
      earlyend: Number
    },
    required: true
  },
  double: {
    type: {
      categories: [
        {
          title: String,
          questions: [
            {
              question: String,
              answer: String,
              asked: Boolean,
              dailydouble: Boolean
            }
          ]
        }
      ],
      earlyend: Number
    },
    required: true
  },
  final: {
    type: {
      category: String,
      question: String,
      answer: String
    },
    required: true
  },
  screen: {
    type: String, // board or question
    required: true
  },
  shown: {
    type: Number, // for question page only
    required: true
  }
});

gameSchema
  .path('contestants')
  .validate(
    value => value.length >= 2,
    'Game needs to have at least two contestants'
  );

gameSchema.statics.addGame = function addGame(
  uid,
  contestants,
  singlecsv,
  doublecsv,
  finaltxt,
  callback
) {
  if (uid.length === 0) {
    callback({
      msg: 'Unique identifier for game cannot be empty'
    });
    return;
  }
  const obj = {
    uid,
    round: 'single',
    contestants: parseGameFiles.parseContestantsCSV(contestants),
    single: {
      categories: parseGameFiles.parseGameCSV(singlecsv, 1),
      earlyend: randomEarlyEnd(30) // TODO: actual num questions
    },
    double: {
      categories: parseGameFiles.parseGameCSV(doublecsv, 2),
      earlyend: randomEarlyEnd(30)
    },
    final: parseGameFiles.parseFinalTXT(finaltxt),
    screen: 'board',
    shown: 0
  };
  this.create(obj, callback);
};

gameSchema.statics.getGame = function getGame(uid, callback) {
  this.findOne({ uid }, callback);
};

gameSchema.statics.askQuestion = function askQuestion(uid, qid, callback) {
  // get the game so we can figure out what round we are in
  this.findOne({ uid }, (err, game) => {
    if (err || !game) {
      callback({
        msg: 'Game does not exist'
      });
      return;
    }
    const board =
      game.round === 'single' ? game.single.categories : game.double.categories;
    const earlyend =
      game.round === 'single' ? game.single.earlyend : game.double.earlyend;
    // convert qid to two indexes
    const qPerC = board[0].questions.length;
    const cNum = Math.floor(qid / qPerC).toString(); // category
    const v = (qid % qPerC).toString(); // value - 1
    // count number of unasked questions
    board[cNum].questions[v].asked = true; // set this one to asked since it might not be
    const unaskedQuestions = board.reduce(
      (t1, c) => t1 + c.questions.reduce((t2, q) => t2 + (q.asked ? 0 : 1), 0),
      0
    );
    // build update
    const updateObj = {};
    updateObj[`${game.round}.categories.${cNum}.questions.${v}.asked`] = true;
    // next round if end condition reached
    if (unaskedQuestions <= earlyend) {
      updateObj.round = game.round === 'single' ? 'double' : 'final';
    }
    this.updateOne({ uid }, { $set: updateObj }, callback);
  });
};

gameSchema.statics.updateScore = function updateScore(
  uid,
  key,
  diff,
  callback
) {
  const updateObj = {};
  updateObj[`contestants.${key.toString()}.score`] = diff;
  this.updateOne({ uid }, { $inc: updateObj }, callback);
};

gameSchema.statics.updateScreen = function updateScreen(uid, screen, callback) {
  const updateObj = {};
  updateObj.screen = screen;
  updateObj.shown = 0;
  this.updateOne({ uid }, { $set: updateObj }, callback);
};

gameSchema.statics.updateShown = function updateShown(uid, shown, callback) {
  const updateObj = {};
  updateObj.shown = shown;
  this.updateOne({ uid }, { $set: updateObj }, callback);
};

module.exports = mongoose.model('Game', gameSchema);
