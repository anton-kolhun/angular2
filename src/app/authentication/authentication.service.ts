import {Injectable} from "@angular/core";
import {Headers} from "@angular/http";
import {UserCreds} from "./authentication.component";
import {isNullOrUndefined} from "util";
import {User} from "../common/common.dto";
import {LOGIN_ENDPOINT, SERVER_URL, USERS_ENDPOINT} from "../common/common.endpoint";
import {HttpClientService} from "../common/httpclient.service";

@Injectable()
export class AuthenticationService {

  loggedUser: User = new User();

  constructor(private httpClientService: HttpClientService) {
    let cookies = this.getCookies();

    if (!isNullOrUndefined(cookies['userId'])) {
      this.loggedUser.Id = cookies['userId'];

      let headers = new Headers();
      headers.append('API_KEY', 'SmSqG%2f876hd4HzUDnTovOEoG39DAEy8YAc2ipGDC51M%3d');

      this.httpClientService.doGet(SERVER_URL + USERS_ENDPOINT + cookies['userId'])
        .map(res => {
          return res.json()
        })
        .subscribe((success: any) => {
            this.loggedUser = new User();
            this.loggedUser.Id = success.Id;
            this.loggedUser.First = success.First;
          },
          error => console.log('error')
        );
    }

  }

  login(userCreds: UserCreds) {
    let body: any = {Login: userCreds.name, Password: userCreds.password};
    return this.httpClientService.doPost(SERVER_URL + LOGIN_ENDPOINT, body)
      .map(res => {
        let result = res.json();
        this.loggedUser = result;
        this.setUserIdCookie(result);
        return result;
      })
  }

  logout() {
    document.cookie = 'userId=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    this.loggedUser = new User();
  }

  getLoggedUser(): User {
    return this.loggedUser;
  }

  isAuthenticated(): boolean {
    return this.loggedUser.Id != null;
  }

  getCookies(): any {
    let cookies = {};
    let coockieMap = document.cookie.split(';');
    coockieMap.forEach(pair => {
      var coockiePair: string[] = pair.split('=');
      cookies[coockiePair[0]] = coockiePair[1];
    })
    return cookies;
  }

  setUserIdCookie(result: any) {
    var d = new Date();
    d.setTime(d.getTime() + (15 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = 'userId=' + result.Id + ';' + expires + ';path=/';
    this.loggedUser = result;
    return result;
  }

}
