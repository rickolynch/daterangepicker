# date-picker-directive

Angular date picker

## Description

This is a date picker that uses a directive which you can place on your html input. Compatible with Angular2+

## Installation

*npm i date-picker-directive --save*

## Dependencies
-

## Basic Usage

### 1. Add *DatepickerModule* import to your *@NgModule* like example below
``` typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MyTestApp } from './my-test-app';
import { DatePickerModule } from 'date-picker-directive';

@NgModule({
    imports:      [ BrowserModule, DatePickerModule ],
    declarations: [ MyTestApp ],
    bootstrap:    [ MyTestApp ]
})
export class MyTestAppModule {}
```
### 2. Add the directive and additional options to your HTML input
``` html
<input type="text" placeholder="Input Date" date-picker (dateselected)="dateSelected($event)" />
```
### 3. Provide method for date selected event
``` typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  dateval: string = null;
  dateSelected(val) {
    this.dateval = val;
  }
}
```

## Attributes
The following options are available for the date picker

*NB* all date options must be entered in the format *MM/DD/YYYY*

| Option        | Default    | Type  | Description |
| ------------- | ------------- | ----- | ----- |
| singleDatePicker | false | boolean | Determine whether to show a single calendar or show a range calendar |
| minDate | no default value | string | Set earliest date in the past that the calendar can show. |
| maxdate | no default value | string | Set the latest date in the future which the calendar can show |
| startDate | Today | string | Set the start date of the selected range on the calendar. If using singleDatePicker, then this property should be used to set the default selected date on the calendar |
| endDate | Today | string | Set the end date of the selected range on the calendar. |

## Events

### dateselected

This event is triggered when a date is selected. If using a single calendar then it is triggered once a date is clicked and returns a single date "MM/DD/YYYY". When using a range calendar, it is triggered when a default range is selected or the apply button is clicked and returns a date range "MM/DD/YYYY" - "MM/DD/YYYY". 

## Author
* Author: Ricardo Lynch

## License
This project is licensed under the MIT License 

# Keywords
* Date Picker
* Date Range
* Angular2+
* Typescript
* ng4
* ng2
* ng
* Directive