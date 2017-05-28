var mongoose = require('mongoose');
var parseGameFiles = require('../utils/parseGameFiles');

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
    	type: [{
    		name: String,
    		score: Number
    	}],
    	required: true
    },
    single: {
        type: [{
        	title: String,
        	questions: [
        		{
        			question: String,
        			answer: String,
        			asked: Boolean,
        			dailydouble: Boolean
        		}
        	]
        }],
        required: true
    },
    double: {
        type: [{
        	title: String,
        	questions: [
        		{
        			question: String,
        			answer: String,
        			asked: Boolean,
        			dailydouble: Boolean
        		}
        	]
        }],
        required: true
    },
    final: {
        type: {
        	category: String,
        	question: String,
        	answer: String
        },
        required: true
    }
});

gameSchema.path('contestants').validate(function(value) {
    return value.length >= 2;
}, 'Game needs to have at least two contestants');


gameSchema.statics.addGame = function(uid, contestants, singlecsv, doublecsv, finaltxt, callback) {
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
        single: parseGameFiles.parseGameCSV(singlecsv),
        double: parseGameFiles.parseGameCSV(doublecsv),
        final: parseGameFiles.parseFinalTXT(finaltxt)
    }
    this.create(obj, callback);
};

gameSchema.statics.getGame = function(uid, callback) {
    this.findOne({uid: uid}, callback);
};

gameSchema.statics.askQuestion = function(uid, qid, callback) {
    var that = this;
    // get the game so we can figure out what round we are in
    that.findOne({uid: uid}, function(err, game) {
        if (err) {
            callback({
                msg: 'Game does not exist'
            });
            return;
        }
        var board = game.round == 'single' ? game.single : game.double;
        // convert qid to two indexes
        var q_per_c = board[0].questions.length;
        var c = Math.floor(qid/q_per_c).toString(); // category
        var v  = (qid % q_per_c).toString(); // value - 1
        // count number of unasked questions
        board[c].questions[v].asked = true; // set this one to asked since it might not be
        var unasked_questions = board.reduce(function(t1, c) {
            return t1 + c.questions.reduce(function(t2, q) {
                return t2 + (q.asked ? 0 : 1);
            }, 0);
        }, 0);
        console.log(unasked_questions);
        // build update
        var updateObj = {};
        updateObj[game.round+"."+c+".questions."+v+".asked"] = true;
        if (unasked_questions == 0) {
            updateObj['round'] = game.round == 'single' ? 'double' : 'final';
        }
        that.update({uid : uid}, {$set : updateObj}, callback);
    });
};

module.exports = mongoose.model('Game', gameSchema);