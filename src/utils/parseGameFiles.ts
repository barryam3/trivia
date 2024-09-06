import { CSVToArray } from "./csv_to_array";
import type {
  Question,
  Category,
  Contestant,
  FinalRound,
} from "../interfaces/game";
import { range } from "./range";

// return a random integer in the range [min, max]
function randint(min: number, max: number): number {
  const lb = Math.ceil(min);
  const ub = Math.floor(max) + 1;
  return Math.floor(Math.random() * (ub - lb)) + lb;
}

export const parseGameCSV = (csvdata: string, numDD: number): Category[] => {
  // parse data into 2d array
  const arr = CSVToArray(csvdata, ",");
  // randomize daily doubles
  const dd: number[] = [];
  const numQ = arr[0].length * ((arr.length - 1) / 2) - 1;
  for (let i = 0; i < numDD; i++) {
    let qid: number;
    do {
      qid = randint(0, numQ - 1);
    } while (dd.indexOf(qid) !== -1);
    dd.push(qid);
  }
  const out: Category[] = [];
  for (const j of range(0, arr[0].length)) {
    const title = arr[0][j];
    const questions: Question[] = [];
    for (const i of range(0, (arr.length - 1) / 2)) {
      const question = {
        question: arr[i * 2 + 1][j],
        answer: arr[i * 2 + 2][j],
        asked: false,
        dailydouble: dd.indexOf(i + (j * (arr.length - 1)) / 2) !== -1,
      };
      questions.push(question);
    }
    const category = {
      title,
      questions,
    };
    out.push(category);
  }
  return out;
};

export const parseContestantsCSV = (csvdata: string): Contestant[] => {
  const arr = CSVToArray(csvdata, ","); // split the single line on the commas
  return arr[0].map((name) => {
    const contestant = {
      name,
      score: 0,
    };
    return contestant;
  });
};

export const parseFinalTXT = (txtdata: string): FinalRound => {
  const arr = CSVToArray(txtdata, ","); // using to split by line
  const final = {
    category: arr[0][0],
    question: arr[1][0],
    answer: arr[2][0],
  };
  return final;
};
