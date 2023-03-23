/* eslint-disable @angular-eslint/no-input-rename */
import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  SimpleChanges,
} from "@angular/core";

@Directive({
  selector: "[appMultiply]",
  standalone: true,
})
export class MultiplyByDirective {
  @Input("multiplyBy") factor!: number; // Input for the factor to multiply by
  @Input("valueToMultiply") valueToMultiply!: number;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges) {
    const value = this.valueToMultiply;
    const result = (value * this.factor).toFixed(2); // Multiply the value by the factor
    this.renderer.setProperty(this.el.nativeElement, "innerText", result); // Update the element value
  }
}
