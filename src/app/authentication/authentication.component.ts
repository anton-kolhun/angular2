import {Component, OnInit} from "@angular/core";
import {AuthenticationService} from "./authentication.service";
import {Router} from "@angular/router";
import {User} from "../common/common.dto";

@Component({
  selector: 'app-login',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  userCreds: UserCreds = new UserCreds();
  loggedUser: User = new User();
  errorMessage: string;


  constructor(private authService: AuthenticationService, private router: Router) {
  }

  ngOnInit() {
  }

  login() {
    this.errorMessage = '';
    this.authService.login(this.userCreds)
      .subscribe(success => {
          this.loggedUser.First = success.First;
          this.router.navigate(['']);
        },
        error => {
          this.errorMessage = JSON.parse(error._body).Message
        })
  }

}

export class UserCreds {
  name: string;
  password: string;
}
