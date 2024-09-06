import { parseGameCSV } from "./parseGameFiles";

test("parseGameCSV", () => {
  const actual = parseGameCSV("a,b,c\n1,2,3\n4,5,6", 0);
  expect(actual).toMatchObject([
    {
      title: "a",
      questions: [{ question: "1", answer: "4" }],
    },
    {
      title: "b",
      questions: [{ question: "2", answer: "5" }],
    },
    {
      title: "c",
      questions: [{ question: "3", answer: "6" }],
    },
  ]);
});
