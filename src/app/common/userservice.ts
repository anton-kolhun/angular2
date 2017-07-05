import {Injectable} from "@angular/core";
import {HttpClientService} from "./httpclient.service";
import {SERVER_URL, USERS_ENDPOINT} from "./common.endpoint";

@Injectable()
export class UserService {

  constructor(public httpClientService: HttpClientService) {
  }

  getUser(userId: number) {
    return this.httpClientService.doGet(SERVER_URL + USERS_ENDPOINT + userId)
      .map(res => res.json())
  }


}
