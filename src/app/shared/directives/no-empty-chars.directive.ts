import { Directive, ElementRef, HostListener, inject } from "@angular/core";

@Directive({
  selector: "[appNoEmptyChars]",
  standalone: true,
})
export class NoEmptyCharsDirective {
  private el = inject(ElementRef);

  @HostListener("input", ["$event"]) onInputChange() {
    const initalValue = this.el.nativeElement.value;
    if (!/\S/.test(initalValue)) {
      // Didn't find something other than a space which means it's empty
      this.el.nativeElement.value = initalValue.replace(" ", "");
    }
  }
}
