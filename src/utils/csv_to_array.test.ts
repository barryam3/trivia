import { CSVToArray } from "./csv_to_array";

describe("CSVToArray", () => {
  test("basic", () => {
    const actual = CSVToArray("a,b,c\n1,2,3\n4,5,6", ",");
    expect(actual).toEqual([
      ["a", "b", "c"],
      ["1", "2", "3"],
      ["4", "5", "6"],
    ]);
  });

  test("single cell", () => {
    const actual = CSVToArray("a", ",");
    expect(actual).toEqual([["a"]]);
  });

  test("single row", () => {
    const actual = CSVToArray("a,b,c", ",");
    expect(actual).toEqual([["a", "b", "c"]]);
  });

  test("single column", () => {
    const actual = CSVToArray("a\nb\nc", ",");
    expect(actual).toEqual([["a"], ["b"], ["c"]]);
  });

  test("empty string", () => {
    const actual = CSVToArray("", ",");
    expect(actual).toEqual([[]]);
  });

  // Weird behavior I don't necessarily agree with but also probably won't come up:

  test("1 comma only", () => {
    const actual = CSVToArray(",", ",");
    expect(actual).toEqual([[""]]);
  });

  test("2 commas only", () => {
    const actual = CSVToArray(",,", ",");
    expect(actual).toEqual([["", ""]]);
  });

  test("1 newline only", () => {
    const actual = CSVToArray("\n", ",");
    expect(actual).toEqual([[], [""]]);
  });

  test("2 newlines only", () => {
    const actual = CSVToArray("\n\n", ",");
    expect(actual).toEqual([[], [""], [""]]);
  });
});
