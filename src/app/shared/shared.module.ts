import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NumberDirective } from "./directives/numbers-only.directive";

@NgModule({
  declarations: [NumberDirective],
  imports: [CommonModule],
  exports: [NumberDirective],
})
export class SharedModule {}
