export function sum(input: Array<number>, initial = 0): number {
  return input.reduce(
    (previous: number, current: number) => previous + current,
    initial
  );
}
