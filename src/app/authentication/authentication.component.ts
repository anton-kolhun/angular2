import {Component} from '@angular/core';
import {AuthenticationService} from './authentication.service';
import {Router} from '@angular/router';
import {extractServerErrorMessage, User} from '../common/common.object';

@Component({
  selector: 'app-login',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent {

  userCreds: UserCreds;
  loggedUser: User;
  errorMessage: string;


  constructor(private authService: AuthenticationService, private router: Router) {
    this.userCreds = new UserCreds();
  }


  login() {
    this.errorMessage = '';
    this.authService.login(this.userCreds)
      .subscribe(success => {
          this.loggedUser = new User();
          this.loggedUser.First = success.First;
          this.router.navigate(['']);
        },
        error => {
          this.errorMessage = extractServerErrorMessage(error);
        });
  }

}

export class UserCreds {
  name: string;
  password: string;
}
