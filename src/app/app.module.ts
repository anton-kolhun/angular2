import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

import {AppComponent} from "./app.component";
import {routing} from "./app.routing";
import {TotalTsPipe} from "./timesheet/total-timesheet.pipe";
import {AuthenticationComponent} from "./authentication/authentication.component";
import {AuthenticationService} from "./authentication/authentication.service";
import {AdminComponent} from "./admin/admin.component";
import {AuthenticationGuard} from "./authentication/authentication.guard";
import {TimesheetComponent} from "./timesheet/timesheet.component";
import {HttpClientService} from "./common/httpclient.service";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {DndModule} from "ng2-dnd";
import {ModalModule} from "ng2-modal";
import {UserService} from "./common/userservice";

@NgModule({
  declarations: [
    AppComponent,
    AuthenticationComponent,
    TimesheetComponent,
    TotalTsPipe,
    AdminComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    DndModule.forRoot(),
    ModalModule],
  providers: [AuthenticationGuard, AuthenticationService, HttpClientService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }
}
