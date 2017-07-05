import {Component, OnInit} from "@angular/core";
import {TimesheetService} from "./timesheet.service";
import {isNullOrUndefined, isUndefined} from "util";
import {TimeSheet, User} from "../common/common.dto";

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
  isTimeSheetModified: boolean = false;


  constructor(private timesheetService: TimesheetService) {
  }


  ngOnInit() {
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
                  let date = new Date(ts.Date);
                  this.ticketToTs.get(ticket.Id).set(this.dateToStr(date), ts);
                })
              })
            });
          this.updateWeek();
        },
        error => {
          this.updateEvent.message = JSON.parse(error._body).Message;
          this.updateEvent.success = false;
        });
  }

  todayPlusShift(shift: number): Date {
    let today: Date = new Date();
    let shiftedDate: Date = new Date();
    shiftedDate.setDate(today.getDate() + shift);
    return shiftedDate;
  }

  arrowClick(move: string) {
    if (move == 'forward') {
      this.moveWeek('forward');
    }
    else {
      this.moveWeek('backward');
    }
    this.updateWeek();
  }

  updateWeek(): void {
    this.ticketToTs.forEach((value, ticketId) => {
      this.currentWeekDays.forEach((day) => {
        if (isNullOrUndefined(this.ticketToTs.get(ticketId))) {
          this.ticketToTs.set(ticketId, new Map<string, TimeSheet>())
        }
        if (isUndefined(this.ticketToTs.get(ticketId).get(this.dateToStr(day)))) {
          let ts: TimeSheet = new TimeSheet();
          ts.Date = day.toLocaleDateString();
          ts.TicketId = ticketId;
          this.ticketToTs.get(ticketId).set(this.dateToStr(day), ts);
        }
      });
    });
  }

  moveWeek(moveDirection: string): void {
    let shift = 0;
    if (moveDirection == 'forward') {
      shift = this.currentWeekDays.length;
    } else {
      shift = -this.currentWeekDays.length;
    }
    this.currentWeekDays = Array.from(this.currentWeekDays, date => {
      let shiftedDate: Date = new Date(date.toDateString());
      shiftedDate.setDate(date.getDate() + shift);
      return shiftedDate;
    });
  }

  dateToStr(date: Date): string {
    return date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear();
  }

  saveTimeSheets(): void {
    let dirtyTimeSheets = new Array<TimeSheet>();

    this.ticketToTs.forEach((dateToTs) => {
      dateToTs.forEach((ts) => {
        if (ts.Dirty == true) {
          dirtyTimeSheets.push(ts)
        }
      })
    });
    this.updateEvent = {};
    dirtyTimeSheets.forEach(ts => {
      this.timesheetService.createOrUpdateTimeSheet(ts).subscribe(success => {
          this.updateEvent.success = true;
          ts.Id = success.Id;
          ts.Dirty = false;
          this.isTimeSheetModified = false;
        },
        error => {
          this.updateEvent.message = JSON.parse(error._body).Message;
          this.updateEvent.success = false;
        });
    });

  }

  markAsDirty(ticketId: number, index: number): void {
    if (isNullOrUndefined(this.ticketToTs.get(ticketId).get(this.dateToStr(this.currentWeekDays[index])).Id) &&
      isNullOrUndefined(this.ticketToTs.get(ticketId).get(this.dateToStr(this.currentWeekDays[index])).Dirty)) {
      this.ticketToTs.get(ticketId).get(this.dateToStr(this.currentWeekDays[index])).TicketId = ticketId;
      this.ticketToTs.get(ticketId).get(this.dateToStr(this.currentWeekDays[index])).Date =
        this.currentWeekDays[index].toLocaleDateString();
    }
    this.ticketToTs.get(ticketId).get(this.dateToStr(this.currentWeekDays[index])).Dirty = true;
    this.isTimeSheetModified = true;
  }

  isHighlighted(ts: TimeSheet): string {
    if (ts.Dirty) {
      return 'bg-info';
    }
    return '';
  }

  addComment(ts: TimeSheet): void {
    let result = prompt('Update comment:', ts.Comment != null ? ts.Comment : '');
    if (result != null) {
      ts.Comment = result;
      ts.Dirty = true;
      this.isTimeSheetModified = true;
    }
  }

  isTimesheetModified(): boolean {
    return this.isTimeSheetModified;
  }

}



