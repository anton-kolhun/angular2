import {Injectable} from "@angular/core";
import {TimeSheet, User} from "../common/common.dto";

import "rxjs/add/operator/map";

import {isNullOrUndefined} from "util";
import {AuthenticationService} from "../authentication/authentication.service";
import {SERVER_URL, TIMESHEETS_ENDPOINT} from "../common/common.endpoint";
import {HttpClientService} from "../common/httpclient.service";
import {UserService} from "../common/userservice";


@Injectable()
export class TimesheetService {

  constructor(private httpClientService: HttpClientService, private authService: AuthenticationService,
              private baseService: UserService) {
  }

  getUser() {
    let user: User = this.authService.getLoggedUser();
    return this.baseService.getUser(user.Id);
  }

  createOrUpdateTimeSheet(timesheet: TimeSheet) {
    let body: any = {
      TaskId: timesheet.TicketId,
      LoggedTime: timesheet.LoggedTime,
      Date: timesheet.Date,
      Comment: timesheet.Comment
    }
    if (isNullOrUndefined(timesheet.Id)) {
      return this.httpClientService.doPost(SERVER_URL + TIMESHEETS_ENDPOINT, body)
        .map(res => res.json())
    }
    body.Id = timesheet.Id;
    return this.httpClientService.doPut(SERVER_URL + TIMESHEETS_ENDPOINT, body)
      .map(res => res.json())
  }


}
