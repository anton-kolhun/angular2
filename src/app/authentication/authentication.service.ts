import {Injectable} from '@angular/core';
import {UserCreds} from './authentication.component';
import {isNullOrUndefined, User} from '../common/common.object';
import {LOGIN_ENDPOINT, SERVER_URL, USERS_ENDPOINT} from '../common/common.endpoint';
import {HttpClientService} from '../common/httpclient.service';
import {COOKIE_EXPIRATION_DURATION} from '../common/common.constant';

@Injectable()
export class AuthenticationService {

  loggedUser: User;

  constructor(private httpClientService: HttpClientService) {
    const cookies = this.getCookies();

    if (!isNullOrUndefined(cookies['userId'])) {
      this.loggedUser = new User();
      this.loggedUser.Id = cookies['userId'];

      this.httpClientService.doGet(SERVER_URL + USERS_ENDPOINT + cookies['userId'])
        .map(res => {
          return res.json();
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
    const body: any = {Login: userCreds.name, Password: userCreds.password};
    return this.httpClientService.doPost(SERVER_URL + LOGIN_ENDPOINT, body)
      .map(res => {
        const result = res.json();
        this.loggedUser = result;
        this.setUserIdCookie(result);
        return result;
      });
  }

  logout() {
    document.cookie = 'userId=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    this.loggedUser = null;
  }

  isAuthenticated(): boolean {
    return !isNullOrUndefined(this.loggedUser);
  }

  getCookies(): any {
    const cookies = {};
    const coockieMap = document.cookie.split(';');
    coockieMap.forEach(pair => {
      const coockiePair: string[] = pair.split('=');
      cookies[coockiePair[0]] = coockiePair[1];
    });
    return cookies;
  }

  setUserIdCookie(result: any) {
    const d = new Date();
    d.setTime(d.getTime() + (COOKIE_EXPIRATION_DURATION));
    document.cookie = `userId=${result.Id};expires=${d.toUTCString()};path=/`;
    this.loggedUser = result;
    return result;
  }

}
