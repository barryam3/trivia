import { CSVToArray } from "./csv_to_array";

test("parseGameCSV", () => {
  const actual = CSVToArray("a,b,c\n1,2,3\n4,5,6", ",");
  expect(actual).toEqual([
    ["a", "b", "c"],
    ["1", "2", "3"],
    ["4", "5", "6"],
  ]);
});
