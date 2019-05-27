var CSVToArray = require('./csv_to_array').CSVToArray;

// return an array of integers in range [start, stop)
var range = function(start, stop) {
  var arr = [];
  var i;
  for (i = 0; i < stop; i++) {
    arr.push(i);
  }
  return arr;
};

// return a random integer in the range [min, max]
var randint = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max) + 1;
  return Math.floor(Math.random() * (max - min)) + min;
};

exports.parseGameCSV = function(csvdata, num_dd) {
  // parse data into 2d array
  var arr = CSVToArray(csvdata, ',');
  // randomize daily doubles
  var dd = [];
  var num_q = arr[0].length * ((arr.length - 1) / 2) - 1;
  range(0, num_dd).forEach(function(ignore) {
    do {
      var qid = randint(0, num_q - 1);
    } while (dd.indexOf(qid) != -1);
    dd.push(qid);
  });
  var out = [];
  range(0, arr[0].length).forEach(function(j) {
    var title = arr[0][j];
    var questions = [];
    range(0, (arr.length - 1) / 2).forEach(function(i) {
      var question = {
        question: arr[i * 2 + 1][j],
        answer: arr[i * 2 + 2][j],
        asked: false,
        dailydouble: dd.indexOf(i + (j * (arr.length - 1)) / 2) != -1
      };
      questions.push(question);
    });
    var category = {
      title: title,
      questions: questions
    };
    out.push(category);
  });
  out.forEach(function(category) {
    category.questions.forEach(function(question) {});
  });
  return out;
};

exports.parseContestantsCSV = function(csvdata) {
  var arr = CSVToArray(csvdata, ','); // split the single line on the commas
  return arr[0].map(function(name) {
    var contestant = {
      name: name,
      score: 0
    };
    return contestant;
  });
};

exports.parseFinalTXT = function(txtdata) {
  var arr = CSVToArray(txtdata, ','); // using to split by line
  var final = {
    category: arr[0][0],
    question: arr[1][0],
    answer: arr[2][0]
  };
  return final;
};
