import { addGame } from "./game";
import type { Game } from "../interfaces/game";

describe("addGame", () => {
  test("basic", () => {
    const actual = addGame(
      "test",
      "Ken,Brad,Watson",
      "Category1,Category2\nQuestion11,Question21\nAnswer11,Answer21\nQuestion12,Question22\nAnswer12,Answer22",
      "Category3,Category4\nQuestion31,Question41\nAnswer31,Answer41\nQuestion32,Question42\nAnswer32,Answer42",
      "CategoryF\nQuestionF\nAnswerF",
      ""
    );
    const expected: Game = {
      uid: "test",
      contestants: [
        { name: "Ken", score: 0 },
        { name: "Brad", score: 0 },
        { name: "Watson", score: 0 },
      ],
      single: {
        categories: [
          {
            title: "Category1",
            questions: [
              {
                question: "Question11",
                answer: "Answer11",
                asked: false,
                dailydouble: false,
              },
              {
                question: "Question12",
                answer: "Answer12",
                asked: false,
                dailydouble: false,
              },
            ],
          },
          {
            title: "Category2",
            questions: [
              {
                question: "Question21",
                answer: "Answer21",
                asked: false,
                dailydouble: false,
              },
              {
                question: "Question22",
                answer: "Answer22",
                asked: false,
                dailydouble: false,
              },
            ],
          },
        ],
      },
      double: {
        categories: [
          {
            title: "Category3",
            questions: [
              {
                question: "Question31",
                answer: "Answer31",
                asked: false,
                dailydouble: false,
              },
              {
                question: "Question32",
                answer: "Answer32",
                asked: false,
                dailydouble: false,
              },
            ],
          },
          {
            title: "Category4",
            questions: [
              {
                question: "Question41",
                answer: "Answer41",
                asked: false,
                dailydouble: false,
              },
              {
                question: "Question42",
                answer: "Answer42",
                asked: false,
                dailydouble: false,
              },
            ],
          },
        ],
      },
      final: {
        category: "CategoryF",
        question: "QuestionF",
        answer: "AnswerF",
      },
      multiplier: 2,
      logs: [],
      disableBoard: false,
      teams: undefined,
    };
    expect(actual).toEqual(expected);
  });
  test("teams", () => {
    const actual = addGame(
      "teams",
      "Alvin,Abigail,Brendan,Brittany",
      "Category1,Category2\nQuestion11,Question21\nAnswer11,Answer21\nQuestion12,Question22\nAnswer12,Answer22",
      "Category3,Category4\nQuestion31,Question41\nAnswer31,Answer41\nQuestion32,Question42\nAnswer32,Answer42",
      "CategoryF\nQuestionF\nAnswerF",
      "Team A,Team B"
    );
    expect(actual).toMatchObject({
      disableBoard: true,
      teams: ["Team A", "Team B"],
    });
  });
});
