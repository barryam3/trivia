var CSVToArray = require('./csv_to_array').CSVToArray;

var range = function(start, stop) {
	var arr = []
	var i;
	for (i = 0; i < stop; i++) {
		arr.push(i);
	}
	return arr;
}

exports.parseGameCSV = function(csvdata) {
	var arr = CSVToArray(csvdata, ',');
	var out = [];
	range(0, arr[0].length).forEach(function(j) {
		var title = arr[0][j];
		var questions = []
		range(0, (arr.length-1)/2).forEach(function(i) {
			var question = {
				question: arr[i*2+1][j],
				answer: arr[i*2+2][j],
				asked: false,
				dailydouble: false // TODO
			}
			questions.push(question);
		});
		var category = {
			title: title,
			questions: questions
		}
		out.push(category);
	});
	out.forEach(function(category) {
		category.questions.forEach(function(question) {
		});
	});
	return out
}

exports.parseContestantsCSV = function(csvdata) {
	var arr = CSVToArray(csvdata, ','); // split the single line on the commas
	return arr[0].map(function(name) {
		var contestant = {
			name: name,
			score: 0
		}
		return contestant;
	});
}

exports.parseFinalTXT = function(txtdata) {
	var arr = CSVToArray(txtdata, ','); // using to split by line
	var final = {
		category: arr[0][0],
		question: arr[1][0],
		answer: arr[2][0]
	}
	return final
}