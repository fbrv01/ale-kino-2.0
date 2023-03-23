/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from "@angular/core";
import { sum } from "./utils";

@Pipe({ name: "sum", standalone: true })
export default class SumPipe implements PipeTransform {
  transform(input: number | number[]): number {
    if (typeof input === "number") {
      return input;
    } else {
      return sum(input);
    }
  }
}
