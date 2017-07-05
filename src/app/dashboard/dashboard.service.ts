import {Injectable} from "@angular/core";
import {Ticket, User} from "../common/common.dto";

import "rxjs/add/operator/map";
import {AuthenticationService} from "../authentication/authentication.service";
import {SERVER_URL, TICKETS_ENDPOINT} from "../common/common.endpoint";
import {HttpClientService} from "../common/httpclient.service";
import {isNullOrUndefined} from "util";
import {UserService} from "../common/userservice";


@Injectable()
export class DashboardService {

  constructor(private httpClientService: HttpClientService, private authService: AuthenticationService,
              private baseService: UserService) {
  }

  getUser() {
    let user: User = this.authService.getLoggedUser();
    return this.baseService.getUser(user.Id);
  }

  createOrUpdateTicket(ticket: Ticket) {
    if (isNullOrUndefined(ticket.Id)) {
      return this.httpClientService.doPost(SERVER_URL + TICKETS_ENDPOINT, ticket);
    }
    return this.httpClientService.doPut(SERVER_URL + TICKETS_ENDPOINT, ticket);
  }

  deleteTicket(ticket: Ticket) {
    return this.httpClientService.doDelete(SERVER_URL + TICKETS_ENDPOINT + ticket.Id);
  }

}
