import {Component, OnInit, ViewChild} from '@angular/core';
import {TimesheetService} from './timesheet.service';
import {extractServerErrorMessage, isNullOrUndefined, TimeSheet, User} from '../common/common.object';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css'],
  providers: [TimesheetService]
})
export class TimesheetComponent implements OnInit {
  user: User;
  currentWeekDays: Date[];
  ticketToTs: Map<number, Map<string, TimeSheet>> = new Map();
  projectToTicket: Map<number, number[]> = new Map();
  updateEvent: any = {};
  isTimeSheetModified = false;
  activeTs: TimeSheet;

  @ViewChild('tsModal') tsModal: any;


  constructor(private timesheetService: TimesheetService) {
  }


  ngOnInit() {
    this.activeTs = new TimeSheet();
    this.currentWeekDays = [this.todayPlusShift(-2), this.todayPlusShift(-1),
      this.todayPlusShift(0), this.todayPlusShift(1), this.todayPlusShift(2)];

    this.timesheetService.getUser()
      .subscribe(user => {
          this.user = user;
          this.user.Projects
            .forEach(project => {
              if (isNullOrUndefined(this.projectToTicket.get(project.Id))) {
                this.projectToTicket.set(project.Id, []);
              }
              project.Tickets.forEach(ticket => {
                this.projectToTicket.get(project.Id).push(ticket.Id);
                if (isNullOrUndefined(this.ticketToTs.get(ticket.Id))) {
                  this.ticketToTs.set(ticket.Id, new Map<string, TimeSheet>());
                }
                ticket.TimeSheets.forEach((ts: TimeSheet) => {
                  const date = new Date(ts.Date);
                  this.ticketToTs.get(ticket.Id).set(this.dateToStr(date), ts);
                });
              });
            });
          this.updateWeek();
        },
        error => {
          this.updateEvent.message = extractServerErrorMessage(error);
          this.updateEvent.success = false;
        });
  }

  todayPlusShift(shift: number): Date {
    const today: Date = new Date();
    const shiftedDate: Date = new Date();
    shiftedDate.setDate(today.getDate() + shift);
    return shiftedDate;
  }

  arrowClick(move: string) {
    if (move === 'forward') {
      this.moveWeek('forward');
    } else {
      this.moveWeek('backward');
    }
    this.updateWeek();
  }

  updateWeek(): void {
    this.ticketToTs.forEach((value, ticketId) => {
      this.currentWeekDays.forEach((day) => {
        if (isNullOrUndefined(this.ticketToTs.get(ticketId))) {
          this.ticketToTs.set(ticketId, new Map<string, TimeSheet>());
        }
        if (isNullOrUndefined(this.ticketToTs.get(ticketId).get(this.dateToStr(day)))) {
          const ts: TimeSheet = new TimeSheet();
          ts.Date = day.toLocaleDateString();
          ts.TicketId = ticketId;
          this.ticketToTs.get(ticketId).set(this.dateToStr(day), ts);
        }
      });
    });
  }

  moveWeek(moveDirection: string): void {
    let shift = 0;
    if (moveDirection === 'forward') {
      shift = this.currentWeekDays.length;
    } else {
      shift = -this.currentWeekDays.length;
    }
    this.currentWeekDays = Array.from(this.currentWeekDays, date => {
      const shiftedDate: Date = new Date(date.toDateString());
      shiftedDate.setDate(date.getDate() + shift);
      return shiftedDate;
    });
  }

  dateToStr(date: Date): string {
    return date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear();
  }

  saveTimeSheets(): void {
    const dirtyTimeSheets = new Array<TimeSheet>();

    this.ticketToTs.forEach((dateToTs) => {
      dateToTs.forEach((ts) => {
        if (ts.Dirty === true) {
          dirtyTimeSheets.push(ts);
        }
      });
    });
    this.updateEvent = {};
    dirtyTimeSheets.forEach(ts => {
      this.saveOrUpdateTimeSheet(ts);
    });
  }

  markAsDirty(ticketId: number, index: number): void {
    const ticketToBeMarked = this.ticketToTs.get(ticketId).get(this.dateToStr(this.currentWeekDays[index]));
    if (isNullOrUndefined(ticketToBeMarked.Id) && isNullOrUndefined(ticketToBeMarked.Dirty)) {
      ticketToBeMarked.TicketId = ticketId;
      ticketToBeMarked.Date = this.currentWeekDays[index].toLocaleDateString();
    }
    ticketToBeMarked.Dirty = true;
    this.isTimeSheetModified = true;
  }

  isHighlighted(ts: TimeSheet): string {
    if (ts.Dirty) {
      return 'bg-info';
    }
    return '';
  }

  addComment(ts: TimeSheet): void {
    if (isNullOrUndefined(ts.LoggedTime)) {
      return;
    }
    const result = prompt('Update comment:', ts.Comment != null ? ts.Comment : '');
    if (result != null) {
      ts.Comment = result;
      ts.Dirty = true;
      this.isTimeSheetModified = true;
    }
  }

  isTimesheetModified(): boolean {
    return this.isTimeSheetModified;
  }

  openTsModalWindow(timesheetToModify: TimeSheet): void {
    this.activeTs = JSON.parse(JSON.stringify(timesheetToModify));
    this.tsModal.open();
  }

  saveOrUpdateTimeSheet(timesheet: TimeSheet): void {
    this.updateEvent = {};
    this.timesheetService.createOrUpdateTimeSheet(timesheet).subscribe(success => {
        this.updateEvent.success = true;
        const matchingTsInTable: TimeSheet = this.ticketToTs.get(success.TicketId)
          .get(this.dateToStr(new Date(success.Date)));
        matchingTsInTable.Id = success.Id;
        matchingTsInTable.Dirty = false;
        matchingTsInTable.LoggedTime = success.LoggedTime;
        matchingTsInTable.Comment = success.Comment;
        this.isTimeSheetModified = false;
      },
      error => {
        this.updateEvent.message = extractServerErrorMessage(error);
        this.updateEvent.success = false;
      });
  }

  updateTsFromModalWindow() {
    this.saveOrUpdateTimeSheet(this.activeTs);
    this.tsModal.close();
  }

  closeTsModalWindow(form: any) {
    this.activeTs = new TimeSheet();
    form.reset();
  }


}



