import { parseGameCSV } from "./parseGameFiles";

test("parseGameCSV", () => {
  const actual = parseGameCSV("a,b,c\n1,2,[DD]: 3\n4,5,6", 0);
  expect(actual).toMatchObject([
    {
      title: "a",
      questions: [{ question: "1", answer: "4", dailydouble: false }],
    },
    {
      title: "b",
      questions: [{ question: "2", answer: "5", dailydouble: false }],
    },
    {
      title: "c",
      questions: [{ question: "3", answer: "6", dailydouble: true }],
    },
  ]);
});
