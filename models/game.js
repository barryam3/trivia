var mongoose = require('mongoose');
var parseGameFiles = require('../utils/parseGameFiles');

// returns 0 with probability .5
//         1 w.p. .25
//         2 w.p. .125
//         ...
//         limit with remaining probability
var randomEarlyEnd = function(limit) {
  var i = 0;
  while (Math.random() < 0.5 && i < limit) {
    i++;
  }
  return i;
};

var gameSchema = mongoose.Schema({
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

gameSchema.path('contestants').validate(function(value) {
  return value.length >= 2;
}, 'Game needs to have at least two contestants');

gameSchema.statics.addGame = function(
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
  var obj = {
    uid: uid,
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

gameSchema.statics.getGame = function(uid, callback) {
  this.findOne({ uid: uid }, callback);
};

gameSchema.statics.askQuestion = function(uid, qid, callback) {
  var that = this;
  // get the game so we can figure out what round we are in
  that.findOne({ uid: uid }, function(err, game) {
    if (err) {
      callback({
        msg: 'Game does not exist'
      });
      return;
    }
    var board =
      game.round == 'single' ? game.single.categories : game.double.categories;
    var earlyend =
      game.round == 'single' ? game.single.earlyend : game.double.earlyend;
    // convert qid to two indexes
    var q_per_c = board[0].questions.length;
    var c = Math.floor(qid / q_per_c).toString(); // category
    var v = (qid % q_per_c).toString(); // value - 1
    // count number of unasked questions
    board[c].questions[v].asked = true; // set this one to asked since it might not be
    var unasked_questions = board.reduce(function(t1, c) {
      return (
        t1 +
        c.questions.reduce(function(t2, q) {
          return t2 + (q.asked ? 0 : 1);
        }, 0)
      );
    }, 0);
    // build update
    var updateObj = {};
    updateObj[
      game.round + '.categories.' + c + '.questions.' + v + '.asked'
    ] = true;
    // next round if end condition reached
    if (unasked_questions <= earlyend) {
      updateObj['round'] = game.round == 'single' ? 'double' : 'final';
    }
    that.updateOne({ uid: uid }, { $set: updateObj }, callback);
  });
};

gameSchema.statics.updateScore = function(uid, key, diff, callback) {
  var updateObj = {};
  updateObj['contestants.' + key.toString() + '.score'] = diff;
  this.updateOne({ uid: uid }, { $inc: updateObj }, callback);
};

gameSchema.statics.updateScreen = function(uid, screen, callback) {
  var updateObj = {};
  updateObj['screen'] = screen;
  updateObj['shown'] = 0;
  this.updateOne({ uid: uid }, { $set: updateObj }, callback);
};

gameSchema.statics.updateShown = function(uid, shown, callback) {
  var updateObj = {};
  updateObj['shown'] = shown;
  this.updateOne({ uid: uid }, { $set: updateObj }, callback);
};

module.exports = mongoose.model('Game', gameSchema);
