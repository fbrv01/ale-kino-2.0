import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "multiply", standalone: true })
export class MultiplyPipe implements PipeTransform {
  transform(value: number, args: number): number {
    return value * args;
  }
}
