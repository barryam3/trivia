const { CSVToArray } = require('./csv_to_array');

// return an array of integers in range [start, stop)
function range(start, stop) {
  const arr = [];
  for (let i = 0; i < stop; i += 1) {
    arr.push(i);
  }
  return arr;
}

// return a random integer in the range [min, max]
function randint(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max) + 1;
  return Math.floor(Math.random() * (max - min)) + min;
}

exports.parseGameCSV = (csvdata, numDD) => {
  // parse data into 2d array
  const arr = CSVToArray(csvdata, ',');
  // randomize daily doubles
  const dd = [];
  const numQ = arr[0].length * ((arr.length - 1) / 2) - 1;
  range(0, numDD).forEach(() => {
    let qid;
    do {
      qid = randint(0, numQ - 1);
    } while (dd.indexOf(qid) !== -1);
    dd.push(qid);
  });
  const out = [];
  range(0, arr[0].length).forEach(j => {
    const title = arr[0][j];
    const questions = [];
    range(0, (arr.length - 1) / 2).forEach(i => {
      const question = {
        question: arr[i * 2 + 1][j],
        answer: arr[i * 2 + 2][j],
        asked: false,
        dailydouble: dd.indexOf(i + (j * (arr.length - 1)) / 2) !== -1
      };
      questions.push(question);
    });
    const category = {
      title,
      questions
    };
    out.push(category);
  });
  out.forEach(category => {
    category.questions.forEach(() => {});
  });
  return out;
};

exports.parseContestantsCSV = csvdata => {
  const arr = CSVToArray(csvdata, ','); // split the single line on the commas
  return arr[0].map(name => {
    const contestant = {
      name,
      score: 0
    };
    return contestant;
  });
};

exports.parseFinalTXT = txtdata => {
  const arr = CSVToArray(txtdata, ','); // using to split by line
  const final = {
    category: arr[0][0],
    question: arr[1][0],
    answer: arr[2][0]
  };
  return final;
};
