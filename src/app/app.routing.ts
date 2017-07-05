import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TimesheetComponent} from './timesheet/timesheet.component';
import {AuthenticationComponent} from './authentication/authentication.component';
import {AdminComponent} from './admin/admin.component';
import {AuthenticationGuard} from './authentication/authentication.guard';
import {DashboardComponent} from './dashboard/dashboard.component';

const appRoutes: Routes = [
  {
    path: '',
    component: TimesheetComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'login',
    component: AuthenticationComponent
  },
  {
    path: 'dashboard/:projectId',
    component: DashboardComponent,
    canActivate: [AuthenticationGuard]
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
