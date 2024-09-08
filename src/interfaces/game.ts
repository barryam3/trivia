export interface Contestant {
  name: string;
  score: number;
}

export interface Round {
  categories: Category[];
}

export interface Category {
  title: string;
  questions: Question[];
}

export interface Question {
  question: string;
  answer: string;
  asked: boolean;
  dailydouble: boolean;
}

export interface FinalRound {
  category: string;
  question: string;
  answer: string;
}

export interface Game {
  uid: string;
  contestants: Contestant[];
  single: Round;
  double: Round;
  final: FinalRound;
  multiplier: number;
  logs: Array<
    [
      /*contestant=*/ string,
      /*round=*/ number,
      /*category=*/ number,
      /*question=*/ number,
      /*score=*/ number
    ]
  >;
}
