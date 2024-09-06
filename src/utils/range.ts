/** return an array of integers in range [start, stop) */
export function range(start: number, stop: number): number[] {
  const arr = [];
  for (let i = 0; i < stop; i += 1) {
    arr.push(i);
  }
  return arr;
}
