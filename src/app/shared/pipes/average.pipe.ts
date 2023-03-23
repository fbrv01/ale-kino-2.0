import { Pipe, PipeTransform } from "@angular/core";
import { sum } from "./utils";

@Pipe({
  name: "avg",
  standalone: true,
})
export class AveragePipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(values: number | number[]) {
    if (typeof values === "number") {
      return values;
    } else {
      const numSum = sum(values);
      return numSum / values.length;
    }
  }
}
