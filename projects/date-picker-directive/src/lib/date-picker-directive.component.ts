import { Component, OnInit, ElementRef, EventEmitter, Input, HostListener } from '@angular/core';

@Component({
  selector: 'date-picker-directive',
  template: "<div class=\"rl-drpicker\">\n  <div id=\"range-container\" class=\"column\" *ngIf=\"singleDatePicker==false\">\n    <div *ngFor=\"let range of ranges\" class=\"range\" (mouseenter)=\"rangeHover(range)\" (mouseleave)=\"hoverExit()\" (click)=\"rangeClick(range)\">{{range.title}}</div>\n    <div class=\"buttons\">\n      <button class=\"apply\" (click)=\"applyClick()\">Apply</button>\n      <button class=\"cancel\" (click)=\"cancelClick()\">Cancel</button>\n    </div>\n  </div>\n  <div id=\"calendar-container\" class=\"column left\">\n    <div class=\"calendar-input\">\n      <input type=\"text\" placeholder=\"Start Date\" [value]=\"displayStartDate\" [class.focused]=\"focusedInput=='start'\" (change)=\"inputChanged($event, 'start')\"\n        (focus)=\"inputFocus('start')\" (blur)=\"inputBlur('start')\" />\n    </div>\n    <div class=\"calendar-table\">\n      <div class=\"calendar-period\">\n        <div class=\"nav-button prev\" (click)=\"clickPrev()\" *ngIf=\"prevAvailable()\">\n          <i class=\"calendar-nav\"></i>\n        </div>\n        {{getMonth('left')}}\n        <div class=\"nav-button next\" (click)=\"clickNext()\" *ngIf=\"nextAvailable() && singleDatePicker==true\">\n          <i class=\"calendar-nav\"></i>\n        </div>\n      </div>\n      <div class=\"days-header\">\n        <div class=\"day\" *ngFor=\"let day of days\">{{day}}</div>\n      </div>\n      <div class=\"calendar-row\" *ngFor=\"let row of leftCalendar.calendar\">\n        <div *ngFor=\"let col of row\" [class.today]=\"isToday(col)\" [class.off]=\"notActiveMonth(col, 'left')\" [class.active]=\"isActiveDate(col)\"\n          [class.in-range]=\"isInRange(col)\" [class.disabled]=\"isDisabled(col)\" [ngClass]=\"{'start-date':isStartDate(col), 'end-date':isEndDate(col)}\"\n          (mouseenter)=\"hoverdate(col)\" (mouseleave)=\"hoverExit()\" (click)=\"clickdate(col, 'left')\">{{col.getDate()}}</div>\n      </div>\n    </div>\n  </div>\n  <div id=\"calendar-container\" class=\"column right\" *ngIf=\"singleDatePicker==false\">\n    <div class=\"calendar-input\">\n      <input type=\"text\" placeholder=\"End Date\" [value]=\"displayEndDate\" [class.focused]=\"focusedInput=='end'\" (change)=\"inputChanged($event, 'end')\"\n        (focus)=\"inputFocus('end')\" (blur)=\"inputBlur('start')\" />\n    </div>\n    <div class=\"calendar-table\">\n      <div class=\"calendar-period\">\n        <div class=\"nav-button next\" (click)=\"clickNext()\" *ngIf=\"nextAvailable()\">\n          <i class=\"calendar-nav\"></i>\n        </div>\n        {{getMonth('right')}}</div>\n      <div class=\"days-header\">\n        <div class=\"day\" *ngFor=\"let day of days\">{{day}}</div>\n      </div>\n      <div class=\"calendar-row\" *ngFor=\"let row of rightCalendar.calendar\">\n        <div *ngFor=\"let col of row\" [class.today]=\"isToday(col)\" [class.off]=\"notActiveMonth(col, 'right')\" [class.active]=\"isActiveDate(col)\"\n          (mouseleave)=\"hoverExit()\" [class.in-range]=\"isInRange(col)\" [class.disabled]=\"isDisabled(col)\" [ngClass]=\"{'start-date':isStartDate(col), 'end-date':isEndDate(col)}\"\n          (mouseenter)=\"hoverdate(col)\" (click)=\"clickdate(col, 'right')\">{{col.getDate()}}</div>\n      </div>\n    </div>\n  </div>\n</div>\n",
  styles: [".rl-drpicker{z-index:995;position:absolute;top:5px;left:0;font-family:\"Helvetica Neue\",Helvetica,Arial,sans-serif;display:flex;border:1px solid #eee;background-color:#fff;-webkit-box-shadow:0 6px 12px rgba(0,0,0,.175);box-shadow:0 6px 12px rgba(0,0,0,.175);width:auto;padding:10px;color:#333}.rl-drpicker>.column{/*display:inline-block;vertical-align:top*/}.rl-drpicker>#range-container{width:140px;margin-right:10px;}.rl-drpicker>#range-container>.range{font-size:11pt;background-color:#f5f5f5;border:1px solid #f5f5f5;color:#08c;padding:5px 12px;margin-bottom:10px;cursor:pointer}.rl-drpicker>#range-container>.range:hover{background-color:#08c;border:1px solid #08c;color:#fff}.rl-drpicker>#calendar-container{margin-right:10px; width:230px;}.rl-drpicker>#calendar-container .calendar-input{padding:0 15px;margin-bottom:10px}.rl-drpicker>#calendar-container .calendar-input>input{width:100%;font-size:10pt;padding:5px 0 5px 5px;border:1px solid #ccc}.rl-drpicker>#calendar-container .calendar-input input.focused{border:1px solid #08c}.rl-drpicker>#calendar-container .calendar-period{text-align:center;font-weight:800;font-size:10pt;margin:7px 10px 3px 15px;line-height:24px;height:24px}.rl-drpicker>#calendar-container .calendar-period .nav-button{height:100%;width:32px;vertical-align:top;text-align:center;cursor:pointer}.rl-drpicker>#calendar-container .calendar-period .nav-button>.calendar-nav{border:solid #333;border-width:0 3px 3px 0;padding:5px;display:inline-block}.rl-drpicker>#calendar-container .calendar-period .nav-button.prev{float:left}.rl-drpicker>#calendar-container .calendar-period .nav-button.prev>.calendar-nav{transform:rotate(135deg);-webkit-transform:rotate(135deg)}.rl-drpicker>#calendar-container .calendar-period .nav-button.next{float:right}.rl-drpicker>#calendar-container .calendar-period .nav-button.next>.calendar-nav{transform:rotate(-45deg);-webkit-transform:rotate(-45deg)}.rl-drpicker>#calendar-container .calendar-period .nav-button:hover .calendar-nav{border:solid #08c;border-width:0 3px 3px 0}.rl-drpicker>#calendar-container .days-header>div{display:inline-block;font-weight:800;font-size:10pt;white-space:nowrap;text-align:center;width:32px;height:32px;line-height:32px}.rl-drpicker>#calendar-container .calendar-row>div{cursor:pointer;display:inline-block;font-weight:500;font-size:10pt;white-space:nowrap;text-align:center;width:32px;height:32px;line-height:32px}.rl-drpicker>#calendar-container .calendar-row>div:hover{background-color:#eee;color:#333}.rl-drpicker>#calendar-container .calendar-row>div.active:not(.off){background-color:#08c!important;color:#fff!important}.rl-drpicker>#calendar-container .calendar-row>div.in-range:not(.off){background-color:#ebf4f8;color:#333}.rl-drpicker>#calendar-container .calendar-row .today:not(.off){background:#b71c1c;color:#fff}.rl-drpicker>#calendar-container .calendar-row .off{color:#999}.rl-drpicker>#calendar-container .calendar-row .disabled{color:#999;text-decoration:line-through}.rl-drpicker>#calendar-container:last-of-type{margin-right:0}.rl-drpicker .buttons{display: flex;justify-content:space-between;}.rl-drpicker .buttons>button{padding:5px 10px;font-size:11pt;cursor:pointer}.rl-drpicker .buttons button.apply{background:#08c;color:#fff;border:1px solid #08c}.rl-drpicker .buttons button.apply:hover{background:#1565c0}.rl-drpicker .buttons button.cancel{background:#eee;border:1px solid #ddd}.rl-drpicker .buttons button.cancel:hover{background:#ccc}.rl-drpicker:before{position:absolute;display:inline-block;top:-9px;border-right:7px solid transparent;border-left:7px solid transparent;border-bottom:9px solid #eee;content:''}"]
})
export class DatePickerDirectiveComponent implements OnInit {

  _mindate: any = null;
  @Input()
  set minDate(date) {
    if (date) {
      this._mindate = new Date(date);
    }
  }
  get minDate() {
    return this._mindate;
  }
  _maxdate: any = null;
  @Input()
  set maxDate(date) {
    if (date) {
      this._maxdate = new Date(date);
    }
  }
  get maxDate() {
    return this._maxdate;
  }

  @Input() singleDatePicker?: boolean = false;

  // _singleDatePicker: boolean = false;
  // @Input()
  // set singleDatePicker(isSingle) {
  //   if (isSingle) {
  //     this._singleDatePicker = isSingle;
  //   }
  // }
  // get singleDatePicker() {
  //   return this._singleDatePicker;
  // }
  linkedCalendars = true;

  _startDate: any;
  @Input()
  set startDate(date) {
    if (date) {
      this._startDate = new Date(date);
    }
  }
  get startDate() {
    return this._startDate;
  }

  _endDate: any;
  @Input()
  set endDate(date) {
    if (date) {
      this._endDate = new Date(date);
    }
  }
  get endDate() {
    return this._endDate;
  }

  monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  tmpDate: any = null;
  tmpEndDate: any = null;
  leftCalendar;
  rightCalendar;
  ranges: any[];
  days: any = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  displayStartDate: string;
  displayEndDate: string;
  focusedInput: string = 'start';
  close = new EventEmitter();
  dateSelected = new EventEmitter();
  constructor() { }

  ngOnInit() {
    this.ranges = [{
      title: 'Today',
      period: [new Date(), new Date()]
    }, {
      title: 'Yesterday',
      period: [this.getYesterday(), this.getYesterday()]
    }, {
      title: 'Last 7 Days',
      period: [this.getPast7Days(), new Date()]
    }, {
      title: 'Last 30 Days',
      period: [this.getPast30Days(), new Date()]
    }, {
      title: 'This Month',
      period: [this.getFirstDay(), new Date()]
    }, {
      title: 'Last Month',
      period: [this.getFirstDayPrev(), this.getLastDayPrev()]
    }];
    if (!this.startDate) {
      this._startDate = new Date();
    }
    this.leftCalendar = { month: new Date(this.startDate.getTime()), calendar: null };

    if (!this.endDate) {
      this._endDate = new Date(this.startDate);
    }
    this.rightCalendar = { month: this.getNextMonth(this.endDate), calendar: null };

    this.displayStartDate = this.startDate.toLocaleDateString();;
    this.displayEndDate = this.endDate.toLocaleDateString();;
    this.renderCalendar('left');
    this.renderCalendar('right');
    console.log(this.singleDatePicker);
  }

  getYesterday() {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  }
  getPast7Days() {
    let date = new Date();
    date.setDate(date.getDate() - 6);
    return date;
  }
  getPast30Days() {
    let date = new Date();
    date.setDate(date.getDate() - 29);
    return date;
  }
  getFirstDay() {
    let date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  getFirstDayPrev() {
    let date = new Date();
    return new Date(date.getFullYear(), (date.getMonth() - 1), 1);
  }
  getLastDayPrev() {
    let date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 0);
  }
  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }
  getLastMonth(date) {
    let d = new Date(date.getTime());
    let c = new Date(d.getTime());
    c.setMonth((d.getMonth() - 1));
    return c;
  }
  getNextMonth(date) {
    let d = new Date(date.getTime());
    return new Date(d.setMonth(d.getMonth() + 1));
  }
  getMonthYear(date) {
    return date.getFullYear() + "-" + date.getMonth();
  }
  isBefore(d1, d2) {
    return d1 < d2;
  }
  isAfter(d1, d2) {
    return d2 < d1;
  }
  renderCalendar(side: string) {
    let date = (side == 'left' ? this.leftCalendar.month : this.rightCalendar.month);
    let month = date.getMonth();
    let year = date.getFullYear();
    let daysInMonth = this.daysInMonth(month + 1, year);
    let firstDay = new Date(year, month, 1);
    let lastDay = new Date(year, month, daysInMonth);
    let lastMonth = this.getLastMonth(firstDay).getMonth();
    let lastYear = this.getLastMonth(firstDay).getFullYear();
    let daysInLastMonth = this.daysInMonth(lastMonth + 1, lastYear);
    let dayOfWeek = firstDay.getDay();
    let calendar = [];
    for (let i = 0; i < 6; i++) {
      calendar[i] = [];
    }

    let startDay = daysInLastMonth - dayOfWeek + 1;

    if (startDay > daysInLastMonth) {
      startDay -= 7;
    }

    if (dayOfWeek === 0) {
      startDay = daysInLastMonth - 6;
    }
    let curDate = new Date(lastYear, lastMonth, startDay);

    let col, row;
    for (let i = 0, col = 0, row = 0; i < 42; i++ , col++ , curDate.setDate(curDate.getDate() + 1)) {

      if (i > 0 && col % 7 === 0) {
        col = 0;
        row++;
      }
      calendar[row][col] = new Date(curDate.getTime());
      curDate.setHours(12);

      if (this.minDate && calendar[row][col].toLocaleDateString() == this.minDate.toLocaleDateString() && this.isBefore(calendar[row][col], this.minDate) && side == 'left') {
        calendar[row][col] = new Date(this.minDate.getTime());
      }

      if (this.maxDate && calendar[row][col].toLocaleDateString() == this.maxDate.toLocaleDateString() && this.isAfter(calendar[row][col], this.maxDate) && side == 'right') {
        calendar[row][col] = new Date(this.maxDate.getTime());
      }

    }

    //make the calendar object available to hoverDate/clickDate
    if (side == 'left') {
      this.leftCalendar.calendar = calendar;
    } else {
      this.rightCalendar.calendar = calendar;
    }
  }
  isToday(day) {
    if (!day) {
      return false;
    }
    return new Date().toLocaleDateString() === day.toLocaleDateString();
  }
  isActiveDate(day) {
    if (day.toLocaleDateString() == this.startDate.toLocaleDateString()) {
      return true;
    } else if (this.endDate && day.toLocaleDateString() == this.endDate.toLocaleDateString()) {
      return true;
    }
    return false;
  }
  isStartDate(day) {
    if (day.toLocaleDateString() == this.startDate.toLocaleDateString()) {
      return true;
    }
    return false;
  }
  isEndDate(day) {
    if (this.endDate && day.toLocaleDateString() == this.endDate.toLocaleDateString()) {
      return true;
    }
    return false;
  }
  isDisabled(day) {
    if (this.minDate && this.isBefore(day, this.minDate)) {
      return true;
    } else if (this.maxDate && this.isAfter(day, this.maxDate)) {
      return true;
    }
    return false;
  }
  isInRange(day) {
    if (this.endDate) {
      if (this.isAfter(day, this.startDate) && this.isBefore(day, this.endDate)) {
        return true;
      } else {
        return false;
      }
    } else {
      if (this.isAfter(day, this.startDate) && this.isBefore(day, this.tmpDate)) {
        return true;
      } else {
        return false;
      }
    }
  }
  nextAvailable() {
    let calendar = (this.singleDatePicker ? this.leftCalendar : this.rightCalendar);
    let lday = new Date(calendar.month.getFullYear(), calendar.month.getMonth() + 1, 0);
    if (!this.maxDate || this.isAfter(this.maxDate, lday)) {
      return true;
    } else {
      return false;
    }
  }
  prevAvailable() {
    let calendar = this.leftCalendar;
    let fday = new Date(calendar.month.getFullYear(), calendar.month.getMonth(), 1);
    if (!this.minDate || this.isBefore(this.minDate, fday)) {
      return true;
    } else {
      return false;
    }
  }
  notActiveMonth(day, side) {
    let cal = (side == 'left' ? this.leftCalendar.calendar : this.rightCalendar.calendar);
    if (day.getMonth() != cal[1][1].getMonth()) {
      return true;
    }
    return false;
  }
  getMonth(side) {
    let cal = (side == 'left' ? this.leftCalendar.calendar : this.rightCalendar.calendar);
    return this.monthNames[cal[1][1].getMonth()] + " " + cal[1][1].getFullYear();
  }
  clickPrev() {
    this.leftCalendar.month.setMonth(this.leftCalendar.month.getMonth() - 1);
    this.renderCalendar('left');
    if (this.rightCalendar.calendar) {
      this.rightCalendar.month.setMonth(this.rightCalendar.month.getMonth() - 1);
      this.renderCalendar('right');
    }
  }
  clickNext() {
    this.leftCalendar.month.setMonth(this.leftCalendar.month.getMonth() + 1);
    this.renderCalendar('left');
    if (this.rightCalendar.calendar) {
      this.rightCalendar.month.setMonth(this.rightCalendar.month.getMonth() + 1);
      this.renderCalendar('right');
    }
  }
  clickdate(day, side) {
    if (this.isDisabled(day)) {
      return false;
    }
    if (this.endDate || this.isBefore(day, this.startDate)) {
      this._endDate = null;
      this.setStartDate(day);
      if (this.tmpEndDate) {
        this.setEndDate(this.tmpEndDate);
      } else {
        this.focusedInput = 'end';
      }
    } else if (!this.endDate && this.isBefore(day, this.startDate)) {
      this.setEndDate(this.startDate);
      this.focusedInput = 'start';
    } else {
      this.setEndDate(day);
      this.focusedInput = 'start';
    }
    if (this.singleDatePicker) {
      this.setEndDate(this.startDate);
      this.focusedInput = 'start';
      this.dateSelected.emit(this.startDate.toLocaleDateString());
    }
    this.updateView();
  }
  rangeClick(range) {
    this.setStartDate(range.period[0]);
    this.setEndDate(range.period[1]);
    this.updateView();
    this.applyClick();
  }
  rangeHover(range) {
    this.displayStartDate = range.period[0].toLocaleDateString();
    this.displayEndDate = range.period[1].toLocaleDateString();
  }
  hoverExit() {
    this.displayStartDate = this.startDate.toLocaleDateString();
    this.displayEndDate = (this.endDate ? this.endDate.toLocaleDateString() : this.displayStartDate);
  }
  hoverdate(day) {
    if (this.isDisabled(day)) {
      return false;
    }
    this.tmpDate = new Date(day.getTime());
    if (this.focusedInput === 'start') {
      this.displayStartDate = this.tmpDate.toLocaleDateString();
    } else {
      this.displayEndDate = this.tmpDate.toLocaleDateString();
    }
  }
  inputFocus(side) {
    this.focusedInput = side;
    if (this.endDate) {
      this.tmpEndDate = new Date(this.endDate.getTime());
      if (side == 'start') {
      } else if (side == 'end') {
        this._endDate = null;
      }
    }

  }
  inputBlur(side) {
  }
  inputChanged(event, side) {
    let val = new Date(event.target.value).toLocaleDateString();
    if (this.isDisabled(val)) {
      return false;
    }
    if (side === 'start') {
      this.setStartDate(val);
    } else if (side === 'end') {
      this.setEndDate(val);
      if (this.isBefore(val, this.startDate)) {
        this.setStartDate(val);
      }
    }
    this.updateView();
  }
  updateView() {
    if (this.endDate) {

      //if both dates are visible already, do nothing
      if (!this.singleDatePicker && this.leftCalendar.month && this.rightCalendar.month &&
        (this.getMonthYear(this.startDate) == this.getMonthYear(this.leftCalendar.month)) || (this.getMonthYear(this.startDate) == this.getMonthYear(this.rightCalendar.month))
        &&
        (this.getMonthYear(this.endDate) == this.getMonthYear(this.leftCalendar.month) || this.getMonthYear(this.endDate) == this.getMonthYear(this.rightCalendar.month))
      ) {
        return;
      }

      this.leftCalendar.month = new Date(this.startDate.getTime());
      if (!this.linkedCalendars && (this.endDate.getMonth() != this.startDate.getMonth() || this.endDate.getFullYear() != this.startDate.getFullYear())) {
        this.rightCalendar.month = new Date(this.endDate.getTime());
      } else {
        this.rightCalendar.month = new Date(this.startDate.getFullYear(), this.startDate.getMonth() + 1, 1);
      }

    } else {
      if (this.getMonthYear(this.leftCalendar.month) != this.getMonthYear(this.startDate) && this.getMonthYear(this.rightCalendar.month) != this.getMonthYear(this.startDate)) {
        this.leftCalendar.month = new Date(this.startDate.getTime());
        this.rightCalendar.month = new Date(this.startDate.getFullYear(), this.startDate.getMonth() + 1, 1);
      }
    }
    if (this.maxDate && this.linkedCalendars && !this.singleDatePicker && this.rightCalendar.month > this.maxDate) {
      this.rightCalendar.month = new Date(this.maxDate.getTime());
      this.leftCalendar.month = new Date(this.maxDate.getFullYear(), this.maxDate.getMonth() - 1, 1);
    }
    this.renderCalendar('left');
    this.renderCalendar('right');
  }
  setStartDate(startDate) {
    if (typeof startDate === 'string')
      this._startDate = new Date(startDate);

    if (typeof startDate === 'object')
      this._startDate = new Date(startDate.getTime());

    this.displayStartDate = this.startDate.toLocaleDateString();
  }
  setEndDate(endDate) {
    if (typeof endDate === 'string')
      this._endDate = new Date(endDate);

    if (typeof endDate === 'object')
      this._endDate = new Date(endDate.getTime());


    this.displayEndDate = this.endDate.toLocaleDateString();
    this.tmpEndDate = null;
  }
  applyClick() {
    this.dateSelected.emit(this.startDate.toLocaleDateString() + ' - ' + this.endDate.toLocaleDateString());
  }
  cancelClick() {
    this.close.emit(false);
  }
}
