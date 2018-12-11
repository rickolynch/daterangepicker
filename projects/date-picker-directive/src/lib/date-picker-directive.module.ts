import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePickerDirectiveComponent } from './date-picker-directive.component';
import { DatePickerDirective } from './date-picker.directive';

@NgModule({
  imports: [CommonModule
  ],
  entryComponents: [DatePickerDirectiveComponent],
  declarations: [DatePickerDirectiveComponent, DatePickerDirective],
  exports: [DatePickerDirectiveComponent, DatePickerDirective]
})
export class DatePickerModule { }
