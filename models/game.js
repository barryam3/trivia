var mongoose = require('mongoose');
var parseGameFiles = require('../utils/parseGameFiles');

var gameSchema = mongoose.Schema({
    uid: {
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
        contestants: parseGameFiles.parseContestantsCSV(contestants),
        single: parseGameFiles.parseGameCSV(singlecsv),
        double: parseGameFiles.parseGameCSV(doublecsv),
        final: parseGameFiles.parseFinalTXT(finaltxt)
    }
    console.log(obj);
    this.create(obj, callback);
};

module.exports = mongoose.model('Game', gameSchema);