import {Component} from '@angular/core';
import {AuthenticationService} from './authentication/authentication.service';
import {Router} from '@angular/router';
import {User} from './common/common.object';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private authService: AuthenticationService, private router: Router) {
  }

  getLoggedUser(): User {
    return this.authService.loggedUser;
  }

  isUserLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }


  logout(): void {
    this.authService.logout();
    this.router.navigate(['login']);
  }

}
