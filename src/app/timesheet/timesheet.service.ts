import {Injectable} from '@angular/core';
import {isNullOrUndefined, TimeSheet, User} from '../common/common.object';

import 'rxjs/add/operator/map';

import {AuthenticationService} from '../authentication/authentication.service';
import {SERVER_URL, TIMESHEETS_ENDPOINT} from '../common/common.endpoint';
import {HttpClientService} from '../common/httpclient.service';
import {UserService} from '../common/userservice';


@Injectable()
export class TimesheetService {

  constructor(private httpClientService: HttpClientService, private authService: AuthenticationService,
              private baseService: UserService) {
  }

  getUser() {
    const user: User = this.authService.loggedUser;
    return this.baseService.getUser(user.Id);
  }

  createOrUpdateTimeSheet(timesheet: TimeSheet) {
    if (isNullOrUndefined(timesheet.Id)) {
      return this.httpClientService.doPost(SERVER_URL + TIMESHEETS_ENDPOINT, timesheet)
        .map(res => res.json());
    }
    return this.httpClientService.doPut(SERVER_URL + TIMESHEETS_ENDPOINT, timesheet)
      .map(res => res.json());
  }


}
